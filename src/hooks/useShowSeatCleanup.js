// hooks/useShowSeatCleanup.js
"use client";
import { useEffect } from 'react';
import { cleanupExpiredShowSeats } from '@/services/showSeatCleanupService';

export function useShowSeatCleanup() {
  useEffect(() => {
    let interval;
    
    const startCleanup = async () => {
      try {
        await cleanupExpiredShowSeats();
        interval = setInterval(cleanupExpiredShowSeats, 2 * 60 * 1000);
      } catch (error) {
        console.error('Failed to start cleanup:', error);
      }
    };

    startCleanup();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const manualCleanup = async () => {
    return await cleanupExpiredShowSeats();
  };

  return { manualCleanup };
}