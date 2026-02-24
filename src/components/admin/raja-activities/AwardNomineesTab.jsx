// components/admin/raja-activity/AwardNomineesTab.jsx
"use client";
import { Award } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function AwardNomineesTab() {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`rounded-xl border p-12 text-center ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <Award className={`w-16 h-16 mx-auto mb-4 ${
        isDarkMode ? 'text-gray-600' : 'text-gray-400'
      }`} />
      <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Award Nominees Coming Soon
      </h3>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        This section is under development
      </p>
    </div>
  );
}