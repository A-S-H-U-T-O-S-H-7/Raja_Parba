// components/admin/users/UserStatusBadge.jsx
"use client";

import useThemeStore from "@/lib/stores/useThemeStore";
import { CheckCircle2, Clock3, Ban, Trash2 } from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    light: "bg-green-50 text-green-700 border-green-200",
    dark: "bg-green-900/30 text-green-300 border-green-700/70",
    dotColor: "bg-green-500",
    icon: CheckCircle2,
  },
  suspended: {
    label: "Suspended",
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "bg-amber-900/30 text-amber-300 border-amber-700/70",
    dotColor: "bg-amber-500",
    icon: Clock3,
  },
  banned: {
    label: "Banned",
    light: "bg-red-50 text-red-700 border-red-200",
    dark: "bg-red-900/30 text-red-300 border-red-700/70",
    dotColor: "bg-red-500",
    icon: Ban,
  },
  deleted: {
    label: "Deleted",
    light: "bg-gray-100 text-gray-700 border-gray-300",
    dark: "bg-gray-800 text-gray-300 border-gray-600",
    dotColor: "bg-gray-500",
    icon: Trash2,
  },
};

export default function UserStatusBadge({ status, showDot = true, showIcon = false }) {
  const { isDarkMode } = useThemeStore();
  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isDarkMode ? config.dark : config.light
      }`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 mr-1" />}
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} mr-1.5`}></span>}
      {config.label}
    </span>
  );
}
