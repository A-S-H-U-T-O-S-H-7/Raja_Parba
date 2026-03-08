"use client";

import { CheckCircle2, Loader2, Users } from "lucide-react";

export default function AssessmentTrackPanel({
  title,
  subtitle,
  total = 0,
  enabled = 0,
  pending = 0,
  onEnableAll,
  enabling = false,
  isDarkMode = false,
}) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${
      isDarkMode ? "border-gray-700 bg-gray-900" : "border-indigo-200 bg-white"
    }`}>
      <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
      <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{subtitle}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className={`rounded-lg border p-2 ${
          isDarkMode ? "border-blue-800 bg-blue-900/30" : "border-blue-200 bg-blue-50"
        }`}>
          <p className={`text-[11px] font-semibold ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>Total</p>
          <p className={`text-sm font-bold ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>{total}</p>
        </div>
        <div className={`rounded-lg border p-2 ${
          isDarkMode ? "border-emerald-800 bg-emerald-900/30" : "border-emerald-200 bg-emerald-50"
        }`}>
          <p className={`text-[11px] font-semibold ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>Enabled</p>
          <p className={`text-sm font-bold ${isDarkMode ? "text-emerald-200" : "text-emerald-800"}`}>{enabled}</p>
        </div>
        <div className={`rounded-lg border p-2 ${
          isDarkMode ? "border-amber-800 bg-amber-900/30" : "border-amber-200 bg-amber-50"
        }`}>
          <p className={`text-[11px] font-semibold ${isDarkMode ? "text-amber-300" : "text-amber-700"}`}>Pending</p>
          <p className={`text-sm font-bold ${isDarkMode ? "text-amber-200" : "text-amber-800"}`}>{pending}</p>
        </div>
      </div>

<div className="space-x-3">
      <button
        type="button"
        onClick={onEnableAll}
        disabled={enabling}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enabling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        Enable Assessment For All Confirmed
      </button>

      <p className={`mt-2 inline-flex items-center gap-1 text-[11px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        <Users className="h-3 w-3" />
        This action creates/enables sessions for confirmed candidates.
      </p>
      </div>

    </div>
  );
}
