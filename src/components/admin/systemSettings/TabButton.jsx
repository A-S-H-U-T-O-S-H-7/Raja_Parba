// components/admin/system/TabButton.jsx
"use client";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function TabButton({ id, label, icon: Icon, isActive, onClick }) {
  const { isDarkMode } = useThemeStore();

  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : isDarkMode
            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="ml-2">{label}</span>
    </button>
  );
}