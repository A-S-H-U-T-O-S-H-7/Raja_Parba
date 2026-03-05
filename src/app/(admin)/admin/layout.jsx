// app/admin/layout.jsx
"use client";
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading, verifySession } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isLoginRoute) {
      if (isAuthenticated) {
        router.replace('/admin/dashboard');
      }
      return;
    }

    if (!isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [loading, isAuthenticated, isLoginRoute, router]);

  if (loading && !isLoginRoute) {
    return <LoadingSpinner />;
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
