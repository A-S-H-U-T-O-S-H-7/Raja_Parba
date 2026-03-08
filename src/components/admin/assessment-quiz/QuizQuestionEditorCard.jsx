"use client";

import { Trash2 } from "lucide-react";

export default function QuizQuestionEditorCard({
  index,
  question,
  onChange,
  onRemove,
  removeDisabled = false,
  isDarkMode = false,
}) {
  const options = Array.isArray(question?.options) ? question.options : ["", "", "", ""];

  return (
    <div className={`rounded-xl border p-3 shadow-sm ${
      isDarkMode ? "border-gray-700 bg-gray-900" : "border-indigo-200 bg-white"
    }`}>
      <div className="mb-2 flex items-center justify-between">
        <p className={`text-xs font-bold ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>Q{index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={removeDisabled}
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
            isDarkMode
              ? "border-rose-700 bg-rose-900/40 text-rose-200"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
      </div>

      <textarea
        value={question?.question || ""}
        onChange={(e) => onChange({ ...question, question: e.target.value })}
        rows={2}
        placeholder="Enter question"
        className={`w-full rounded-lg border px-2.5 py-2 text-sm outline-none focus:ring-1 ${
          isDarkMode
            ? "border-indigo-700 bg-indigo-900/20 text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30"
            : "border-indigo-200 bg-indigo-50/30 text-gray-800 focus:border-indigo-400 focus:ring-indigo-200"
        }`}
      />

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option, optionIdx) => (
          <div key={`${question?.id || index}-opt-${optionIdx}`} className="space-y-1">
            <label className={`text-[11px] font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Option {optionIdx + 1}
            </label>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const nextOptions = [...options];
                nextOptions[optionIdx] = e.target.value;
                const next = { ...question, options: nextOptions };
                if (question?.answer === option) next.answer = e.target.value;
                onChange(next);
              }}
              className={`w-full rounded-md border px-2 py-1.5 text-xs outline-none focus:ring-1 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                  : "border-gray-200 bg-gray-50 text-gray-800 focus:border-indigo-300 focus:ring-indigo-200"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className={`text-[11px] font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Correct Answer</label>
        <select
          value={question?.answer || ""}
          onChange={(e) => onChange({ ...question, answer: e.target.value })}
          className={`mt-1 w-full rounded-md border px-2 py-1.5 text-xs font-semibold outline-none focus:ring-1 ${
            isDarkMode
              ? "border-emerald-700 bg-emerald-900/20 text-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/30"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 focus:border-emerald-300 focus:ring-emerald-200"
          }`}
        >
          <option value="" disabled>
            Select correct option
          </option>
          {options.map((opt, optIdx) => (
            <option key={`${question?.id || index}-answer-${optIdx}`} value={opt}>
              Option {optIdx + 1}: {opt || "(empty)"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
