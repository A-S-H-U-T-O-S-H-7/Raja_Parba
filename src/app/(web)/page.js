"use client"

import { useState } from 'react';
import useAuthStore from '@/lib/stores/useAuthStore';

import HeroSection from '@/components/home/HeroSection';
import RajaParbaCancel from '@/components/Rajaparbacancel';

function HomePage() {
  const { user, loading } = useAuthStore();
  const [noticeClosed, setNoticeClosed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* {!noticeClosed && (
        <RajaParbaCancel
          photoSrc="/sudiptamohanty.jpeg"
          videoSrc="/sudipta_mohanty_video.mp4"
          showOncePerSession={false}
          onClose={() => setNoticeClosed(true)}
        />
      )} */}

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      { !loading && <HeroSection user={user} />}
    </div>
  );
}

export default HomePage;
