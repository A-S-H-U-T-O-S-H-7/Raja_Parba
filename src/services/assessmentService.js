import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  ASSESSMENT_TYPES,
  QUIZ_DURATION_SECONDS,
  assessmentTrackConfig,
} from "@/lib/assessment/templates";

const SESSION_COLLECTION = "assessment_sessions";
const ALLOWED_CONFIRMED_STATUSES = new Set(["confirmed", "approved"]);
const collectionByType = Object.values(assessmentTrackConfig).reduce((acc, cfg) => {
  acc[cfg.key] = cfg.collection;
  return acc;
}, {});

const normalizeValue = (value = "") => String(value || "").trim().toLowerCase();

const getStepStateMap = (steps = []) =>
  steps.reduce((acc, step) => {
    acc[step.id] = {
      status: "pending",
      submittedAt: null,
      data: null,
    };
    return acc;
  }, {});

export const getAssessmentSessionId = (assessmentType, applicationId) =>
  `${assessmentType}_${applicationId}`;

export const getAssessmentTypeForDrawingCategory = (category) => {
  const normalized = normalizeValue(category);
  if (normalized === "senior") return ASSESSMENT_TYPES.DRAWING_SENIOR;
  return ASSESSMENT_TYPES.DRAWING_JUNIOR;
};

export const getCandidateApplicationDoc = async (assessmentType, applicationId) => {
  const config = assessmentTrackConfig[assessmentType];
  if (!config) throw new Error("Invalid assessment type");

  const appDoc = await getDoc(doc(db, config.collection, applicationId));
  if (!appDoc.exists()) return null;
  const data = { id: appDoc.id, ...appDoc.data() };

  if (config.collection === "drawing_applications" && config.requiresDrawingCategory) {
    const category = normalizeValue(data.category);
    if (category !== config.requiresDrawingCategory) return null;
  }

  return data;
};

export const getAssessmentSession = async (assessmentType, applicationId) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionDoc = await getDoc(doc(db, SESSION_COLLECTION, sessionId));
  if (!sessionDoc.exists()) return null;
  return { id: sessionDoc.id, ...sessionDoc.data() };
};

export const getOrCreateAssessmentSession = async ({
  assessmentType,
  applicationId,
  userId,
  candidateName,
  candidateEmail,
}) => {
  const config = assessmentTrackConfig[assessmentType];
  if (!config) throw new Error("Invalid assessment type");
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  const existing = await getDoc(sessionRef);
  if (existing.exists()) return { id: sessionId, ...existing.data() };

  const steps = config.steps || [];
  const now = Timestamp.now();
  const payload = {
    assessmentType,
    applicationId,
    collectionName: config.collection,
    candidateName: candidateName || "Candidate",
    candidateEmail: candidateEmail || "",
    userId: userId || null,
    enabled: false,
    assessmentStatus: "not_enabled",
    currentStepId: steps[0]?.id || null,
    stepStates: getStepStateMap(steps),
    quiz: {
      status: "not_started",
      startedAt: null,
      durationSec: QUIZ_DURATION_SECONDS,
      questions: [],
      answers: {},
      submittedAt: null,
      score: null,
      lockedReason: null,
    },
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(sessionRef, payload, { merge: false });
  return { id: sessionId, ...payload };
};

export const enableAssessmentsForConfirmedCandidates = async ({
  assessmentType,
  adminId,
  adminName,
}) => {
  const config = assessmentTrackConfig[assessmentType];
  if (!config) throw new Error("Invalid assessment type");

  const statusQuery = query(
    collection(db, config.collection),
    where("status", "in", Array.from(ALLOWED_CONFIRMED_STATUSES))
  );
  const statusSnap = await getDocs(statusQuery);
  let candidates = statusSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (!candidates.length) {
    const reviewQuery = query(
      collection(db, config.collection),
      where("reviewStatus", "in", Array.from(ALLOWED_CONFIRMED_STATUSES))
    );
    const reviewSnap = await getDocs(reviewQuery);
    candidates = reviewSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  if (config.collection === "drawing_applications" && config.requiresDrawingCategory) {
    candidates = candidates.filter(
      (c) => normalizeValue(c.category) === config.requiresDrawingCategory
    );
  }

  const now = serverTimestamp();
  const batch = writeBatch(db);
  let enabledCount = 0;

  candidates.forEach((candidate) => {
    const sessionId = getAssessmentSessionId(assessmentType, candidate.id);
    const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
    batch.set(
      sessionRef,
      {
        assessmentType,
        applicationId: candidate.id,
        collectionName: config.collection,
        candidateName: candidate.name || "Candidate",
        candidateEmail: candidate.email || "",
        userId: candidate.userId || null,
        enabled: true,
        enabledAt: now,
        enabledBy: adminId || null,
        enabledByName: adminName || null,
        assessmentStatus: "enabled",
        currentStepId: config.steps?.[0]?.id || null,
        stepStates: getStepStateMap(config.steps || []),
        quiz: {
          status: "not_started",
          startedAt: null,
          durationSec: QUIZ_DURATION_SECONDS,
          questions: [],
          answers: {},
          submittedAt: null,
          score: null,
          lockedReason: null,
        },
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );
    enabledCount += 1;
  });

  if (enabledCount > 0) {
    await batch.commit();
  }

  return { enabledCount };
};

export const getTrackCandidatesWithSessions = async (assessmentType) => {
  const config = assessmentTrackConfig[assessmentType];
  if (!config) throw new Error("Invalid assessment type");

  const appSnap = await getDocs(collection(db, config.collection));
  let candidates = appSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (config.collection === "drawing_applications" && config.requiresDrawingCategory) {
    candidates = candidates.filter(
      (c) => normalizeValue(c.category) === config.requiresDrawingCategory
    );
  }

  const sessionQuery = query(
    collection(db, SESSION_COLLECTION),
    where("assessmentType", "==", assessmentType)
  );
  const sessionSnap = await getDocs(sessionQuery);
  const sessionMap = new Map(sessionSnap.docs.map((d) => [d.data().applicationId, { id: d.id, ...d.data() }]));

  return candidates.map((candidate) => ({
    ...candidate,
    assessmentSession: sessionMap.get(candidate.id) || null,
  }));
};

export const uploadAssessmentFile = async ({
  assessmentType,
  applicationId,
  stepId,
  file,
}) => {
  const extension = (file?.name || "file").split(".").pop().toLowerCase();
  const timestamp = Date.now();
  const path = `assessments/${assessmentType}/${applicationId}/${stepId}_${timestamp}.${extension}`;
  const storageRef = ref(storage, path);
  const uploadResult = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(uploadResult.ref);
  return {
    url,
    path: uploadResult.ref.fullPath,
    name: file?.name || `${stepId}.${extension}`,
    size: file?.size || 0,
    type: file?.type || "",
  };
};

export const saveAssessmentStep = async ({
  assessmentType,
  applicationId,
  stepId,
  data,
  nextStepId = null,
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    [`stepStates.${stepId}`]: {
      status: "completed",
      submittedAt: Timestamp.now(),
      data: data || null,
    },
    ...(nextStepId ? { currentStepId: nextStepId } : {}),
    assessmentStatus: "in_progress",
    updatedAt: serverTimestamp(),
  });
  return { success: true };
};

export const startQuizAttempt = async ({
  assessmentType,
  applicationId,
  questions,
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    quiz: {
      status: "in_progress",
      startedAt: Timestamp.now(),
      durationSec: QUIZ_DURATION_SECONDS,
      questions: questions || [],
      answers: {},
      submittedAt: null,
      score: null,
      lockedReason: null,
    },
    assessmentStatus: "in_progress",
    updatedAt: serverTimestamp(),
  });
};

export const submitQuizAttempt = async ({
  assessmentType,
  applicationId,
  answers,
  questions,
  score,
  reason = "manual",
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    quiz: {
      status: "submitted",
      startedAt: Timestamp.now(),
      durationSec: QUIZ_DURATION_SECONDS,
      questions: questions || [],
      answers: answers || {},
      submittedAt: Timestamp.now(),
      score: Number.isFinite(score) ? score : 0,
      lockedReason: reason,
    },
    "stepStates.quiz": {
      status: "completed",
      submittedAt: Timestamp.now(),
      data: {
        score: Number.isFinite(score) ? score : 0,
        reason,
      },
    },
    assessmentStatus: "in_progress",
    updatedAt: serverTimestamp(),
  });
};

export const markQuizAbandoned = async ({
  assessmentType,
  applicationId,
  reason = "left_assessment",
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    quiz: {
      status: "abandoned",
      startedAt: Timestamp.now(),
      durationSec: QUIZ_DURATION_SECONDS,
      questions: [],
      answers: {},
      submittedAt: Timestamp.now(),
      score: 0,
      lockedReason: reason,
    },
    assessmentStatus: "locked",
    updatedAt: serverTimestamp(),
  });
};

export const completeAssessmentSession = async ({
  assessmentType,
  applicationId,
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    assessmentStatus: "completed",
    completedAt: Timestamp.now(),
    updatedAt: serverTimestamp(),
  });
};

export const setZoomMeetingByAdmin = async ({
  assessmentType,
  applicationId,
  zoomLink,
  slot,
  note = "",
  adminId = null,
  adminName = null,
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    "stepStates.zoomMeeting.data": {
      zoomLink: String(zoomLink || "").trim(),
      slot: String(slot || "").trim(),
      note: String(note || "").trim(),
      setByAdminId: adminId,
      setByAdminName: adminName,
      scheduledAt: Timestamp.now(),
    },
    updatedAt: serverTimestamp(),
  });
};

export const markZoomMeetingCompletedByAdmin = async ({
  assessmentType,
  applicationId,
}) => {
  const sessionId = getAssessmentSessionId(assessmentType, applicationId);
  const sessionRef = doc(db, SESSION_COLLECTION, sessionId);
  const currentSession = await getAssessmentSession(assessmentType, applicationId);
  const existingData = currentSession?.stepStates?.zoomMeeting?.data || null;
  await updateDoc(sessionRef, {
    "stepStates.zoomMeeting": {
      status: "completed",
      submittedAt: Timestamp.now(),
      data: existingData,
    },
    assessmentStatus: "in_progress",
    updatedAt: serverTimestamp(),
  });
};

export const canStartAssessment = async ({
  assessmentType,
  applicationId,
  userId,
  userEmail,
}) => {
  const application = await getCandidateApplicationDoc(assessmentType, applicationId);
  if (!application) {
    return { allowed: false, reason: "Application not found for this track." };
  }

  const status = normalizeValue(application.status || application.reviewStatus);
  if (!ALLOWED_CONFIRMED_STATUSES.has(status)) {
    return { allowed: false, reason: "Assessment starts only after admin confirmation." };
  }

  const session = await getOrCreateAssessmentSession({
    assessmentType,
    applicationId,
    userId: application.userId || null,
    candidateName: application.name || "",
    candidateEmail: application.email || "",
  });

  const ownerMatch =
    !application.userId ||
    application.userId === userId ||
    (application.email && normalizeValue(application.email) === normalizeValue(userEmail));
  if (!ownerMatch) {
    return { allowed: false, reason: "This assessment does not belong to your account." };
  }

  if (!session?.enabled) {
    return { allowed: false, reason: "Assessment is not enabled yet by admin." };
  }

  return { allowed: true, application, session };
};

export const getAssessmentCollectionByType = () => ({ ...collectionByType });
