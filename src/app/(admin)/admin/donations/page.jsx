// app/admin/donations/page.jsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import DonationManagement from '@/components/admin/donation-management/DonationManagement';
import { Loader2 } from 'lucide-react';

export default function DonationsPage() {
  const { admin, isAuthenticated, loading } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6">
      <DonationManagement />
    </div>
  );
}