"use client";

import { useState } from "react";
import { Loader2, UserRoundPen } from "lucide-react";

export default function SelfIntroductionStep({
  title,
  description,
  existingData,
  onSubmit,
  disabled = false,
}) {
  const [text, setText] = useState(existingData?.text || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({ text: text.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Write your self-introduction here..."
          className="w-full rounded-xl border border-blue-200 bg-blue-50/30 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!text.trim() || submitting || disabled}
          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRoundPen className="h-4 w-4" />}
          Submit Introduction
        </button>
      </form>
    </div>
  );
}

