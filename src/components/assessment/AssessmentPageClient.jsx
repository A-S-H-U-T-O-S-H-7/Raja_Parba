"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Lock,
  PlayCircle,
} from "lucide-react";
import useAuthStore from "@/lib/stores/useAuthStore";
import AssessmentShell from "@/components/assessment/AssessmentShell";
import AssessmentStepNav from "@/components/assessment/AssessmentStepNav";
import VideoUploadStep from "@/components/assessment/steps/VideoUploadStep";
import QuizStep from "@/components/assessment/steps/QuizStep";
import ZoomMeetingStep from "@/components/assessment/steps/ZoomMeetingStep";
import MediaBundleStep from "@/components/assessment/steps/MediaBundleStep";
import {
  assessmentTrackConfig,
  buildShuffledQuiz,
} from "@/lib/assessment/templates";
import { getQuizBankByTrack } from "@/services/assessmentQuizService";
import {
  canStartAssessment,
  completeAssessmentSession,
  getAssessmentSession,
  markQuizAbandoned,
  saveAssessmentStep,
  startQuizAttempt,
  submitQuizAttempt,
  uploadAssessmentFile,
} from "@/services/assessmentService";

export default function AssessmentPageClient({ assessmentType, applicationId }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [application, setApplication] = useState(null);
  const [activeStepId, setActiveStepId] = useState(null);
  const [submittingStep, setSubmittingStep] = useState(false);
  const completionAlertShownRef = useRef(false);

  const config = assessmentTrackConfig[assessmentType];
  const steps = config?.steps || [];

  const stepStates = session?.stepStates || {};

  const isStepCompleted = (stepId) => (stepStates?.[stepId]?.status || "") === "completed";

  const canAccessStepFromStateMap = (stepId, customStepStates = stepStates, indexFromNav = null) => {
    const index = Number.isInteger(indexFromNav)
      ? indexFromNav
      : steps.findIndex((step) => step.id === stepId);
    if (index <= 0) return true;
    for (let i = 0; i < index; i += 1) {
      if ((customStepStates?.[steps[i].id]?.status || "") !== "completed") return false;
    }
    return true;
  };

  const getFirstIncompleteStepId = () => {
    const firstPending = steps.find((step) => !isStepCompleted(step.id));
    return firstPending?.id || steps[0]?.id || null;
  };

  const canAccessStep = (stepId, indexFromNav = null) => {
    return canAccessStepFromStateMap(stepId, stepStates, indexFromNav);
  };

  const getLockedStepId = () => session?.currentStepId || getFirstIncompleteStepId();

  const canNavigateToStep = (stepId) => {
    if (isCompleted) return false;
    return stepId === getLockedStepId();
  };

  const loadSession = async () => {
    if (!user?.uid || !assessmentType || !applicationId) return;
    setLoading(true);
    setError("");
    try {
      const gate = await canStartAssessment({
        assessmentType,
        applicationId,
        userId: user.uid,
        userEmail: user.email,
      });

      if (!gate.allowed) {
        setError(gate.reason || "Assessment is not available.");
        setSession(gate.session || null);
        setApplication(gate.application || null);
        setLoading(false);
        return;
      }

      const currentSession = gate.session;
      if (currentSession?.quiz?.status === "in_progress") {
        await markQuizAbandoned({
          assessmentType,
          applicationId,
          reason: "reentry_blocked",
        });
        const lockedSession = await getAssessmentSession(assessmentType, applicationId);
        setSession(lockedSession);
        setApplication(gate.application);
        setActiveStepId(lockedSession?.currentStepId || steps[0]?.id || null);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setApplication(gate.application);
      setActiveStepId(currentSession?.currentStepId || steps[0]?.id || null);
    } catch (err) {
      setError(err?.message || "Failed to load assessment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      router.push("/login?redirect=/profile");
      return;
    }
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.uid, assessmentType, applicationId]);

  const isLocked = session?.assessmentStatus === "locked" || session?.quiz?.status === "abandoned";
  const isCompleted = session?.assessmentStatus === "completed";
  const allStepsCompleted = useMemo(
    () =>
      steps.length > 0 &&
      steps.every((step) => (stepStates?.[step.id]?.status || "") === "completed"),
    [steps, stepStates]
  );

  const getNextStepId = (currentStepId) => {
    const idx = steps.findIndex((s) => s.id === currentStepId);
    if (idx < 0) return null;
    return steps[idx + 1]?.id || null;
  };

  const refreshSession = async () => {
    const fresh = await getAssessmentSession(assessmentType, applicationId);
    setSession(fresh);
    const firstIncomplete = steps.find((step) => (fresh?.stepStates?.[step.id]?.status || "") !== "completed")?.id;
    const preferredStep = fresh?.currentStepId || firstIncomplete || steps[0]?.id || null;
    setActiveStepId((prev) => {
      const currentStillValid = prev && canAccessStepFromStateMap(prev, fresh?.stepStates || {});
      return currentStillValid ? prev : preferredStep;
    });
  };

  const completeStep = async (stepId, payload) => {
    setSubmittingStep(true);
    try {
      await saveAssessmentStep({
        assessmentType,
        applicationId,
        stepId,
        data: payload,
        nextStepId: getNextStepId(stepId),
      });
      await refreshSession();
      if (stepId !== "quiz") {
        await Swal.fire({
          icon: "success",
          title: "Step Completed Successfully",
          text: "Great work. Moving to the next step.",
          timer: 2400,
          showConfirmButton: false,
          background: "#f0fdf4",
          color: "#166534",
        });
      }
    } finally {
      setSubmittingStep(false);
    }
  };

  const handleUploadSubmit = async (stepId, file) => {
    const fileInfo = await uploadAssessmentFile({
      assessmentType,
      applicationId,
      stepId,
      file,
    });
    await completeStep(stepId, fileInfo);
  };

  const handleMediaBundleSubmit = async (step, files = {}) => {
    const fieldList = step?.fields || [];
    const payload = { files: {} };
    for (const field of fieldList) {
      const file = files[field.key];
      if (!file) {
        throw new Error(`${field.label} is required.`);
      }
      const uploaded = await uploadAssessmentFile({
        assessmentType,
        applicationId,
        stepId: `${step.id}_${field.key}`,
        file,
      });
      payload.files[field.key] = uploaded;
    }
    await completeStep(step.id, payload);
  };

  const handleQuizStart = async () => {
    const bank = await getQuizBankByTrack(assessmentType);
    const questions = buildShuffledQuiz(assessmentType, bank?.questions || []);
    await startQuizAttempt({
      assessmentType,
      applicationId,
      questions,
    });
    await refreshSession();
  };

  const handleQuizSubmit = async (answers, reason = "manual") => {
    const questions = session?.quiz?.questions || [];
    const score = questions.reduce((acc, q) => (answers?.[q.id] === q.answer ? acc + 1 : acc), 0);
    await submitQuizAttempt({
      assessmentType,
      applicationId,
      answers,
      questions,
      score,
      nextStepId: getNextStepId("quiz"),
      reason,
    });
    await refreshSession();
    await Swal.fire({
      icon: "success",
      title: "Quiz Submitted",
      text: `Your score: ${score}/${questions.length}`,
      timer: 2800,
      showConfirmButton: false,
      background: "#ecfeff",
      color: "#0f766e",
    });
  };

  useEffect(() => {
    if (!allStepsCompleted || isCompleted || completionAlertShownRef.current) return;
    (async () => {
      completionAlertShownRef.current = true;
      await completeAssessmentSession({ assessmentType, applicationId });
      await refreshSession();
      await Swal.fire({
        icon: "success",
        title: "Assessment Completed",
        text: "All required steps are completed successfully.",
        timer: 3400,
        background: "#eff6ff",
        color: "#1e3a8a",
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStepsCompleted, isCompleted]);

  useEffect(() => {
    if (!steps.length) return;
    const lockedStepId = getLockedStepId();
    if (!activeStepId || activeStepId !== lockedStepId) {
      setActiveStepId(lockedStepId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length, stepStates, activeStepId, session?.currentStepId]);

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];

  const renderStep = () => {
    if (!activeStep) return null;
    if (!canAccessStep(activeStep.id)) {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          Please complete previous step first.
        </div>
      );
    }

    const existingData = stepStates?.[activeStep.id]?.data || null;
    switch (activeStep.type) {
      case "media_bundle":
        return (
          <MediaBundleStep
            title={activeStep.title}
            description={activeStep.description}
            fields={activeStep.fields || []}
            existingData={existingData}
            onSubmit={(payload) => handleMediaBundleSubmit(activeStep, payload)}
            disabled={submittingStep || isLocked || isCompleted}
          />
        );
      case "video_upload":
        return (
          <VideoUploadStep
            title={activeStep.title}
            description={activeStep.description}
            maxDurationSec={activeStep.maxDurationSec || null}
            existingData={existingData}
            onSubmit={(file) => handleUploadSubmit(activeStep.id, file)}
            disabled={submittingStep || isLocked || isCompleted}
          />
        );
      case "zoom_slot":
        return (
          <ZoomMeetingStep
            title={activeStep.title}
            description={activeStep.description}
            existingData={existingData}
            disabled={submittingStep || isLocked || isCompleted}
          />
        );
      case "quiz":
        return (
          <QuizStep
            questions={session?.quiz?.questions || []}
            durationSec={session?.quiz?.durationSec || 300}
            existingAnswers={session?.quiz?.answers || {}}
            existingStatus={session?.quiz?.status || "not_started"}
            existingScore={session?.quiz?.score}
            isLocked={isLocked || isCompleted}
            onStart={handleQuizStart}
            onSubmit={handleQuizSubmit}
            onBackToProfile={() => router.push("/profile")}
          />
        );
      default:
        return null;
    }
  };

  if (!config) {
    return (
      <AssessmentShell title="Assessment" subtitle="Invalid assessment type">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Invalid assessment route.
        </div>
      </AssessmentShell>
    );
  }

  if (loading) {
    return (
      <AssessmentShell title={`${config.label} Assessment`} subtitle="Loading your assessment">
        <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-semibold text-indigo-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading assessment session...
        </div>
      </AssessmentShell>
    );
  }

  if (error) {
    return (
      <AssessmentShell title={`${config.label} Assessment`} subtitle="Access check">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Back to Profile
          </button>
        </div>
      </AssessmentShell>
    );
  }

  return (
    <AssessmentShell
      title={`${config.label} Assessment`}
      subtitle={`Candidate: ${application?.name || session?.candidateName || "Participant"}`}
    >
      <div className="space-y-4">
        <AssessmentStepNav
          steps={steps}
          stepStates={stepStates}
          activeStepId={activeStep?.id}
          onSelectStep={setActiveStepId}
          canAccessStep={canAccessStep}
          canNavigateToStep={canNavigateToStep}
          quizScore={Number.isFinite(session?.quiz?.score) ? session?.quiz?.score : null}
          quizTotal={session?.quiz?.questions?.length || 15}
          isLocked={isLocked}
        />

        <div className="space-y-3">
          {isCompleted && (
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-rose-50 p-6 text-center shadow-lg">
              <div className="pointer-events-none absolute -right-6 -top-6 text-5xl opacity-20">🎉</div>
              <div className="pointer-events-none absolute -left-5 -bottom-6 text-5xl opacity-20">💖</div>
              <p className="text-4xl">😊 🎊 ❤️</p>
              <p className="mt-3 text-lg font-bold text-emerald-700">
                Congratulations! You have successfully completed your assessment.
              </p>
              <p className="mt-2 text-sm font-semibold text-rose-700">
                We will announce the results very soon. Stay tuned, take care, and keep smiling.
              </p>
              <p className="mt-2 text-base font-bold text-amber-700">Happy Raja Parba ✨</p>
            </div>
          )}

          {isLocked && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              <span className="inline-flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Assessment is locked due to interrupted quiz attempt.
              </span>
            </div>
          )}

          <div className="rounded-xl border border-teal-200 bg-teal-50 p-2 text-xs text-teal-700">
            <span className="inline-flex items-center gap-1 font-semibold text-teal-800">
              <PlayCircle className="h-3.5 w-3.5" />
              Progress:
            </span>{" "}
            {steps.filter((step) => stepStates?.[step.id]?.status === "completed").length}/{steps.length} steps completed
          </div>

          {!isCompleted ? renderStep() : null}
        </div>
      </div>
    </AssessmentShell>
  );
}
