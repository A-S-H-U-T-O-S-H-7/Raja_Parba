// components/admin/admins/AdminPermissionBadge.jsx
"use client";
import { Check, X } from 'lucide-react';
import { AVAILABLE_PERMISSIONS } from '@/lib/stores/useAdminManagementStore';

export default function AdminPermissionBadge({ permissionId }) {
  const permission = AVAILABLE_PERMISSIONS.find(p => p.id === permissionId);
  
  if (!permission) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
      <Check className="w-3 h-3 mr-1 text-green-500" />
      {permission.name}
    </span>
  );
}