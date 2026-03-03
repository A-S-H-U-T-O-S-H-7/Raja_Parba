"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';

export default function ProtectedAdminRoute({
  children,
  requiredPermission = null,
  requiredPermissions = null
}) {
  const { admin, adminUser, loading, hasPermission } = useAdminAuthStore();
  const router = useRouter();
  const currentAdmin = admin || adminUser || null;
  const permissionsToCheck = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : requiredPermission
      ? [requiredPermission]
      : [];
  const hasRequiredAccess =
    permissionsToCheck.length === 0 || permissionsToCheck.some((permission) => hasPermission(permission));

  useEffect(() => {
    if (!loading) { 
      if (!currentAdmin) {
        router.push('/admin/login');
        return;
      }

      if (!hasRequiredAccess) {
        router.push('/admin/dashboard');
        return;
      }
    }
  }, [currentAdmin, loading, router, hasRequiredAccess]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div> 
    );
  }

  if (!currentAdmin) {
    return null;
  }

  if (!hasRequiredAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">You don't have permission to access this feature.</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}
