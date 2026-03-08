import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { defaultQuizBanks } from "@/lib/assessment/templates";

const QUIZ_BANK_COLLECTION = "assessment_quiz_banks";

const normalizeQuestion = (question, index) => {
  const options = Array.isArray(question?.options)
    ? question.options.map((o) => String(o || "").trim())
    : ["", "", "", ""];
  const answer = String(question?.answer || "").trim();
  return {
    id: String(question?.id || `q${index + 1}`),
    question: String(question?.question || "").trim(),
    options: options.slice(0, 4),
    answer,
  };
};

export const validateQuizBank = (questions = []) => {
  if (!Array.isArray(questions) || questions.length < 15) {
    return { valid: false, error: "At least 15 questions are required." };
  }

  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i] || {};
    const text = String(q.question || "").trim();
    const options = Array.isArray(q.options) ? q.options.map((o) => String(o || "").trim()) : [];
    const answer = String(q.answer || "").trim();
    if (!text) return { valid: false, error: `Question ${i + 1} is empty.` };
    if (options.length !== 4 || options.some((o) => !o)) {
      return { valid: false, error: `Question ${i + 1} must have 4 non-empty options.` };
    }
    if (!options.includes(answer)) {
      return { valid: false, error: `Question ${i + 1} answer must match one option.` };
    }
  }

  return { valid: true };
};

export const getQuizBankByTrack = async (trackKey) => {
  const docRef = doc(db, QUIZ_BANK_COLLECTION, trackKey);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return {
      source: "default",
      trackKey,
      questions: defaultQuizBanks[trackKey] || [],
      updatedAt: null,
    };
  }
  const data = snapshot.data() || {};
  const questions = (Array.isArray(data.questions) ? data.questions : []).map(normalizeQuestion);
  return {
    source: "custom",
    trackKey,
    questions: questions.length ? questions : defaultQuizBanks[trackKey] || [],
    updatedAt: data.updatedAt || null,
    updatedBy: data.updatedBy || null,
    updatedByName: data.updatedByName || null,
  };
};

export const saveQuizBankByTrack = async ({
  trackKey,
  questions,
  adminId,
  adminName,
}) => {
  const normalized = (questions || []).map(normalizeQuestion);
  const check = validateQuizBank(normalized);
  if (!check.valid) throw new Error(check.error);

  const docRef = doc(db, QUIZ_BANK_COLLECTION, trackKey);
  await setDoc(
    docRef,
    {
      trackKey,
      questions: normalized,
      updatedAt: serverTimestamp(),
      updatedBy: adminId || null,
      updatedByName: adminName || null,
      versionAt: Timestamp.now(),
    },
    { merge: true }
  );

  return { success: true };
};

