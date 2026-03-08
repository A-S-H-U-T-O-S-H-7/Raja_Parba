"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Video,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import { assessmentTrackConfig } from "@/lib/assessment/templates";
import {
  markZoomMeetingCompletedByAdmin,
  setZoomMeetingByAdmin,
} from "@/services/assessmentService";

const normalize = (value) => String(value || "").trim().toLowerCase();

const StatusBadge = ({ status, isDarkMode = false }) => {
  const statusLower = normalize(status);
  let style = isDarkMode
    ? "border-gray-500/30 bg-gray-500/20 text-gray-300"
    : "border-gray-200 bg-gray-100 text-gray-700";
  let Icon = null;

  if (["completed", "submitted", "approved"].includes(statusLower)) {
    style = isDarkMode
      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
      : "border-emerald-200 bg-emerald-100 text-emerald-700";
    Icon = CheckCircle;
  } else if (["pending", "in_progress", "enabled"].includes(statusLower)) {
    style = isDarkMode
      ? "border-amber-500/30 bg-amber-500/20 text-amber-300"
      : "border-amber-200 bg-amber-100 text-amber-700";
    Icon = Clock;
  } else if (["rejected", "failed", "locked", "abandoned"].includes(statusLower)) {
    style = isDarkMode
      ? "border-rose-500/30 bg-rose-500/20 text-rose-300"
      : "border-rose-200 bg-rose-100 text-rose-700";
    Icon = AlertCircle;
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${style}`}>
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {status || "N/A"}
    </span>
  );
};

const ScoreBadge = ({ score = 0, total = 0, isDarkMode = false }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const textColor =
    percentage >= 80
      ? isDarkMode
        ? "text-emerald-300"
        : "text-emerald-700"
      : percentage >= 60
        ? isDarkMode
          ? "text-amber-300"
          : "text-amber-700"
        : isDarkMode
          ? "text-rose-300"
          : "text-rose-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${
      isDarkMode ? "border-gray-700 bg-gray-800/90" : "border-gray-200 bg-white"
    }`}>
      <span className="mr-1 text-gray-500">Score:</span>
      <span className={textColor}>{score}/{total}</span>
      <span className={`ml-1 text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
        ({percentage}%)
      </span>
    </span>
  );
};

export default function AssessmentCandidateDetailModal({
  isOpen,
  onClose,
  candidate,
  isDarkMode = false,
  onUpdated,
}) {
  const { admin } = useAdminAuthStore();
  const [savingZoom, setSavingZoom] = useState(false);
  const [markingZoom, setMarkingZoom] = useState(false);
  const [showZoomForm, setShowZoomForm] = useState(false);
  const [zoomForm, setZoomForm] = useState({ zoomLink: "", slot: "", note: "" });

  if (!isOpen || !candidate) return null;

  const session = candidate.assessmentSession || {};
  const steps = assessmentTrackConfig[session.assessmentType]?.steps || [];
  const stepStates = session.stepStates || {};
  const quiz = session.quiz || {};
  const answers = quiz.answers || {};
  const questions = quiz.questions || [];

  const completedSteps = steps.filter((step) => normalize(stepStates[step.id]?.status) === "completed").length;

  const zoomIndex = steps.findIndex((s) => s.id === "zoomMeeting");
  const zoomPrevId = zoomIndex > 0 ? steps[zoomIndex - 1].id : null;
  const zoomMeta =
    zoomIndex < 0
      ? { hasZoomStep: false, canSetZoom: false, zoomState: {} }
      : {
          hasZoomStep: true,
          canSetZoom: zoomPrevId ? normalize(stepStates[zoomPrevId]?.status) === "completed" : true,
          zoomState: stepStates.zoomMeeting || {},
        };

  const openZoomForm = () => {
    const existing = zoomMeta.zoomState?.data || {};
    setZoomForm({
      zoomLink: existing.zoomLink || "",
      slot: existing.slot || "",
      note: existing.note || "",
    });
    setShowZoomForm(true);
  };

  const handleSaveZoom = async () => {
    if (!zoomForm.zoomLink.trim() || !zoomForm.slot.trim()) {
      toast.error("Zoom link and timing are required");
      return;
    }
    setSavingZoom(true);
    try {
      await setZoomMeetingByAdmin({
        assessmentType: session.assessmentType,
        applicationId: session.applicationId,
        zoomLink: zoomForm.zoomLink,
        slot: zoomForm.slot,
        note: zoomForm.note,
        adminId: admin?.id || null,
        adminName: admin?.name || admin?.username || "Admin",
      });
      toast.success("Zoom details saved");
      setShowZoomForm(false);
      await onUpdated?.();
    } catch (error) {
      toast.error(error?.message || "Failed to save zoom details");
    } finally {
      setSavingZoom(false);
    }
  };

  const handleMarkZoomComplete = async () => {
    setMarkingZoom(true);
    try {
      await markZoomMeetingCompletedByAdmin({
        assessmentType: session.assessmentType,
        applicationId: session.applicationId,
      });
      toast.success("Zoom step marked completed");
      await onUpdated?.();
    } catch (error) {
      toast.error(error?.message || "Unable to update zoom status");
    } finally {
      setMarkingZoom(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl ${
          isDarkMode ? "border-gray-700/50 bg-gray-900 text-gray-100" : "border-gray-200 bg-white text-gray-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDarkMode ? "bg-indigo-500/20" : "bg-indigo-100"}`}>
              <FileText className={`h-5 w-5 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Assessment Details
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {candidate?.name || "N/A"} | {candidate?.registrationId || candidate?.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition-colors ${
              isDarkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <InfoCard label="Application Status" value={candidate.status || candidate.reviewStatus || "pending"} isDarkMode={isDarkMode} type="status" />
            <InfoCard label="Assessment Status" value={session.assessmentStatus || "not_enabled"} isDarkMode={isDarkMode} type="status" />
            <InfoCard label="Current Step" value={session.currentStepId || "N/A"} isDarkMode={isDarkMode} />
            <InfoCard label="Progress" value={`${completedSteps}/${steps.length} Steps`} isDarkMode={isDarkMode} type="progress" />
          </div>

          {zoomMeta.hasZoomStep && (
            <div className={`rounded-xl border p-4 ${isDarkMode ? "border-violet-900 bg-violet-950/30" : "border-violet-200 bg-violet-50"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={`inline-flex items-center gap-1 text-sm font-semibold ${isDarkMode ? "text-violet-200" : "text-violet-800"}`}>
                    <CalendarClock className="h-4 w-4" />
                    Zoom Step Controls
                  </p>
                  <p className={`mt-1 text-xs ${isDarkMode ? "text-violet-300" : "text-violet-700"}`}>
                    Enable after Step 4 completion, set link/timing/notes, then mark step complete after meeting.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openZoomForm}
                    disabled={!zoomMeta.canSetZoom}
                    className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Set Zoom
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkZoomComplete}
                    disabled={markingZoom || !zoomMeta.canSetZoom || !zoomMeta.zoomState?.data?.zoomLink || normalize(zoomMeta.zoomState?.status) === "completed"}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {markingZoom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Mark Zoom Complete
                  </button>
                </div>
              </div>
              {!zoomMeta.canSetZoom ? (
                <p className={`mt-2 text-xs font-semibold ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>
                  Candidate has not completed Step 4 yet.
                </p>
              ) : null}
            </div>
          )}

          <div className={`rounded-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
            <div className={`border-b px-4 py-3 ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
              <h4 className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Step Submissions
              </h4>
            </div>
            <div className="divide-y p-4">
              {steps.map((step, idx) => {
                const state = stepStates?.[step.id] || {};
                const data = state?.data || {};
                const submitted = normalize(state?.status) === "completed";
                const singleFile = data?.url;
                const bundleFiles = data?.files || {};

                return (
                  <div key={step.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            isDarkMode
                              ? submitted
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-gray-800 text-gray-400"
                              : submitted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                          }`}>
                            {idx + 1}
                          </span>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{step.title}</p>
                        </div>

                        <div className="ml-8 mt-2 space-y-2">
                          {singleFile ? (
                            <a href={singleFile} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                              isDarkMode
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}>
                              <FileText className="h-3.5 w-3.5" />
                              View Upload
                            </a>
                          ) : null}

                          {Object.entries(bundleFiles).map(([key, info]) => (
                            <a
                              key={key}
                              href={info?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mr-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                                isDarkMode
                                  ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              }`}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {key}
                            </a>
                          ))}

                          {data?.zoomLink ? (
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <a href={data.zoomLink} target="_blank" rel="noopener noreferrer" className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
                                <span className="inline-flex items-center gap-1"><Video className="h-3.5 w-3.5" />Join Zoom</span>
                              </a>
                              {data.slot ? <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>{data.slot}</span> : null}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <StatusBadge status={submitted ? "completed" : "pending"} isDarkMode={isDarkMode} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
            <div className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
              <h4 className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Quiz Answers</h4>
              {quiz?.status === "submitted" ? (
                <ScoreBadge score={Number(quiz?.score || 0)} total={questions.length} isDarkMode={isDarkMode} />
              ) : null}
            </div>

            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <StatusBadge status={quiz?.status || "not_started"} isDarkMode={isDarkMode} />
                {quiz?.lockedReason ? (
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{quiz.lockedReason}</span>
                ) : null}
              </div>

              <div className="space-y-3">
                {questions.map((q, index) => {
                  const selected = answers?.[q.id] || "Not answered";
                  const isCorrect = selected === q.answer;

                  return (
                    <div key={q.id || index} className={`rounded-lg border p-3 ${isDarkMode ? "border-gray-800 bg-gray-800/30" : "border-gray-100 bg-gray-50"}`}>
                      <div className="flex items-start gap-2">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-medium ${
                          isDarkMode
                            ? isCorrect
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                            : isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-1.5">
                          <p className={`text-xs font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{q.question}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className={`block text-[10px] uppercase ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Selected</span>
                              <span className={isCorrect ? "text-emerald-600" : "text-rose-600"}>{selected}</span>
                            </div>
                            <div>
                              <span className={`block text-[10px] uppercase ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Correct</span>
                              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{q.answer}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {questions.length === 0 ? (
                  <div className={`rounded-lg border p-4 text-center ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No quiz data available yet.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {showZoomForm ? (
          <div className="border-t border-violet-200 bg-violet-50 p-4">
            <p className="text-sm font-semibold text-violet-800">Set Zoom Details</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <input
                type="url"
                value={zoomForm.zoomLink}
                onChange={(e) => setZoomForm((prev) => ({ ...prev, zoomLink: e.target.value }))}
                placeholder="https://..."
                className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none"
              />
              <input
                type="text"
                value={zoomForm.slot}
                onChange={(e) => setZoomForm((prev) => ({ ...prev, slot: e.target.value }))}
                placeholder="Meeting timing"
                className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none"
              />
              <textarea
                value={zoomForm.note}
                onChange={(e) => setZoomForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Notes"
                rows={3}
                className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none md:col-span-2"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleSaveZoom}
                disabled={savingZoom}
                className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {savingZoom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowZoomForm(false)}
                className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoCard({ label, value, isDarkMode, type = "default" }) {
  const getValueColor = () => {
    if (type === "progress") {
      return isDarkMode ? "text-blue-400" : "text-blue-600";
    }
    return isDarkMode ? "text-white" : "text-gray-900";
  };

  return (
    <div className={`rounded-xl border p-3 ${isDarkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}>
      <p className={`text-[10px] font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      <div className="mt-1">
        {type === "status" ? (
          <StatusBadge status={value} isDarkMode={isDarkMode} />
        ) : (
          <p className={`text-sm font-semibold ${getValueColor()}`}>{String(value || "N/A")}</p>
        )}
      </div>
    </div>
  );
}
