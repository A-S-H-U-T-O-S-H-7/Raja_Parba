"use client";

import { Download } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function ExportExcelButton({ onClick, label = "Export XLS" }) {
  const { isDarkMode } = useThemeStore();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
        isDarkMode
          ? "border-emerald-700 bg-emerald-900/30 text-emerald-200 hover:bg-emerald-900/50"
          : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      <Download className="h-4 w-4" />
      {label}
    </button>
  );
}
