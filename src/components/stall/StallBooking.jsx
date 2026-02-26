// app/stall-booking/page.jsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/stores/useAuthStore';
import StallBookingFlow from './StallBookingFlow';
import { Loader2 } from 'lucide-react';

export default function StallBookingPage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/stall-booking');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <StallBookingFlow />;
}