// components/admin/admins/AdminRoleBadge.jsx
"use client";
import { Shield, User } from 'lucide-react';

export default function AdminRoleBadge({ role }) {
  if (role === 'super_admin') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
        <Shield className="w-3 h-3 mr-1" />
        Super Admin
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
      <User className="w-3 h-3 mr-1" />
      Admin
    </span>
  );
}