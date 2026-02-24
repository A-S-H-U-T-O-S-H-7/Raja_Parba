// components/admin/common/PermissionGate.jsx
"use client";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export default function PermissionGate({ 
  permission,
  anyOf,
  allOf,
  children,
  fallback = null,
  showFallback = true
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAdminAuthStore();

  // Determine if access should be granted
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyOf && anyOf.length > 0) {
    hasAccess = hasAnyPermission(anyOf);
  } else if (allOf && allOf.length > 0) {
    hasAccess = hasAllPermissions(allOf);
  } else {
    hasAccess = true;
  }

  if (hasAccess) {
    return children;
  }

  if (showFallback) {
    return fallback;
  }

  return null;
}

// Custom hook for components
export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, admin } = useAdminAuthStore();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin: () => admin?.role === 'super_admin',
    isAdmin: () => admin?.role === 'admin',
    getCurrentPermissions: () => admin?.permissions || []
  };
}