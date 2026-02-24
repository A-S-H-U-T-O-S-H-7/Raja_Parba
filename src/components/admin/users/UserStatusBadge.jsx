// components/admin/users/UserStatusBadge.jsx
"use client";
import useThemeStore from "@/lib/stores/useThemeStore";

const statusConfig = {
  active: {
    label: 'Active',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-800 dark:text-green-400',
    dotColor: 'bg-green-500',
    icon: '🟢'
  },
  suspended: {
    label: 'Suspended',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-800 dark:text-yellow-400',
    dotColor: 'bg-yellow-500',
    icon: '🟡'
  },
  banned: {
    label: 'Banned',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-400',
    dotColor: 'bg-red-500',
    icon: '🔴'
  },
  deleted: {
    label: 'Deleted',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-800 dark:text-gray-400',
    dotColor: 'bg-gray-500',
    icon: '⚫'
  }
};

export default function UserStatusBadge({ status, showDot = true, showIcon = false }) {
  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} mr-1.5`}></span>
      )}
      {config.label}
    </span>
  );
}