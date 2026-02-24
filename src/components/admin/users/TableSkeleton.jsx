// components/common/TableSkeleton.jsx
"use client";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function TableSkeleton({ columns = 5, rows = 5 }) {
  const { theme } = useThemeStore();

  return (
    <div className={`rounded-xl border overflow-hidden animate-pulse ${
      theme === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className={`p-4 border-b ${
        theme === "dark" ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className={`h-4 w-32 rounded ${
          theme === "dark" ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
      </div>

      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className={`h-4 rounded ${
                  theme === "dark" ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}