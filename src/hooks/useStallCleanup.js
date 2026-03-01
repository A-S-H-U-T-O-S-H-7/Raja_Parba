"use client";
import { useEffect } from 'react';
import { cleanupExpiredStalls } from '@/services/stallCleanupService';

export function useStallCleanup() {
  useEffect(() => {
    let cleanupInterval;

    const startCleanup = async () => {
      try {
        await cleanupExpiredStalls();
        cleanupInterval = setInterval(async () => {
          try {
            await cleanupExpiredStalls();
          } catch (error) {
            console.error('Automatic stall cleanup failed:', error);
          }
        }, 2 * 60 * 1000);
      } catch (error) {
        console.error('Failed to start stall cleanup service:', error);
      }
    };

    startCleanup();

    return () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    };
  }, []);

  const manualCleanup = async () => {
    try {
      return await cleanupExpiredStalls();
    } catch (error) {
      console.error('Manual stall cleanup failed:', error);
      return { success: false, error: error.message };
    }
  };

  return { manualCleanup };
}
