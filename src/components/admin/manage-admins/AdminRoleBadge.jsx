// components/admin/admins/AdminRoleBadge.jsx
"use client";
import { Shield, User } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function AdminRoleBadge({ role }) {
  const { isDarkMode } = useThemeStore();

  if (role === 'super_admin') {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isDarkMode
          ? 'bg-purple-900/30 text-purple-300 border-purple-700/70'
          : 'bg-purple-50 text-purple-700 border-purple-200'
      }`}>
        <Shield className="w-3 h-3 mr-1" />
        Super Admin
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
      isDarkMode
        ? 'bg-blue-900/30 text-blue-300 border-blue-700/70'
        : 'bg-blue-50 text-blue-700 border-blue-200'
    }`}>
      <User className="w-3 h-3 mr-1" />
      Admin
    </span>
  );
}
