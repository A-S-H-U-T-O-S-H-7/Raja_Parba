"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Plus, RotateCcw, Save } from "lucide-react";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import useThemeStore from "@/lib/stores/useThemeStore";
import { defaultQuizBanks } from "@/lib/assessment/templates";
import {
  getQuizBankByTrack,
  saveQuizBankByTrack,
  validateQuizBank,
} from "@/services/assessmentQuizService";
import QuizQuestionEditorCard from "@/components/admin/assessment-quiz/QuizQuestionEditorCard";

const TRACKS = [
  { key: "rajaQueen", label: "Raja Queen" },
  { key: "rajaKumari", label: "Raja Kumari" },
  { key: "drawingSenior", label: "Drawing Senior" },
  { key: "drawingJunior", label: "Drawing Junior" },
];

const createBlankQuestion = (index = 0) => ({
  id: `q${Date.now()}_${index}`,
  question: "",
  options: ["", "", "", ""],
  answer: "",
});

export default function AssessmentQuizSettings() {
  const { admin } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const [activeTrack, setActiveTrack] = useState(TRACKS[0].key);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [source, setSource] = useState("default");
  const [questions, setQuestions] = useState([]);

  const loadTrack = async (trackKey) => {
    setLoading(true);
    try {
      const data = await getQuizBankByTrack(trackKey);
      setQuestions(data?.questions || []);
      setSource(data?.source || "default");
    } catch (error) {
      toast.error("Failed to load question bank");
      setQuestions(defaultQuizBanks[trackKey] || []);
      setSource("default");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrack(activeTrack);
  }, [activeTrack]);

  const stats = useMemo(() => {
    const total = questions.length;
    const validQuestions = questions.filter((q) => {
      const text = String(q?.question || "").trim();
      const options = Array.isArray(q?.options) ? q.options.map((o) => String(o || "").trim()) : [];
      const answer = String(q?.answer || "").trim();
      return text && options.length === 4 && options.every(Boolean) && options.includes(answer);
    }).length;
    return { total, validQuestions };
  }, [questions]);

  const updateQuestion = (index, nextQuestion) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? nextQuestion : q)));
  };

  const handleSave = async () => {
    const check = validateQuizBank(questions);
    if (!check.valid) {
      toast.error(check.error);
      return;
    }
    setSaving(true);
    try {
      await saveQuizBankByTrack({
        trackKey: activeTrack,
        questions,
        adminId: admin?.id || null,
        adminName: admin?.name || admin?.username || "Admin",
      });
      toast.success("Quiz bank saved");
      setSource("custom");
    } catch (error) {
      toast.error(error?.message || "Failed to save quiz bank");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setQuestions(defaultQuizBanks[activeTrack] || []);
    setSource("default");
    toast.success("Loaded default set for editing");
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 shadow-sm ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-indigo-200 bg-white"
      }`}>
        <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Assessment Quiz Settings</h1>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Set track-wise quiz questions, options, and correct answers for candidate assessments.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRACKS.map((track) => (
            <button
              key={track.key}
              type="button"
              onClick={() => setActiveTrack(track.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                activeTrack === track.key
                  ? "border-indigo-300 bg-indigo-600 text-white"
                  : isDarkMode
                    ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border p-4 shadow-sm ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-indigo-200 bg-white"
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Source:{" "}
            <span className={`font-semibold ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
              {source === "custom" ? "Custom (Firestore)" : "Default Template"}
            </span>
            {"  |  "}Valid:{" "}
            <span className={`font-semibold ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>
              {stats.validQuestions}
            </span>{" "}
            / {stats.total}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                isDarkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Load Default
            </button>
            <button
              type="button"
              onClick={() => setQuestions((prev) => [...prev, createBlankQuestion(prev.length)])}
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                isDarkMode
                  ? "border-indigo-700 bg-indigo-900/40 text-indigo-200 hover:bg-indigo-900/60"
                  : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Questions
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${
          isDarkMode
            ? "border-indigo-800 bg-indigo-900/30 text-indigo-200"
            : "border-indigo-200 bg-indigo-50 text-indigo-700"
        }`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading question bank...
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuizQuestionEditorCard
              key={question.id || `q-row-${index}`}
              index={index}
              question={question}
              onChange={(next) => updateQuestion(index, next)}
              onRemove={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
              removeDisabled={questions.length <= 1}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
