"use client";
import { Suspense } from 'react';
import StallManagement from '@/components/admin/stall-seat/StallManagement';

export default function AdminStallsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <StallManagement />
    </Suspense>
  );
}