// app/admin/bookings/stalls/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useStallBookingStore from '@/lib/stores/useStallBookingStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import AdminStallMap from './AdminStallMap';
import AdminVendorDetails from './AdminVendorDetails';
import AdminStallPayment from './AdminStallPayment';
import { 
  Store, 
  User, 
  CreditCard, 
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function AdminStallBookingPage() {
  const router = useRouter();
  const { admin, isAuthenticated } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const { 
    selectedStalls, 
    step, 
    setStep,
    loadStallData,
    loading,
    resetBooking
  } = useStallBookingStore();

  const steps = [
    { id: 1, title: 'Select Stalls', icon: Store, description: 'Choose stalls for vendor' },
    { id: 2, title: 'Vendor Details', icon: User, description: 'Enter vendor information' },
    { id: 3, title: 'Confirm Booking', icon: CreditCard, description: 'Review and confirm' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    loadStallData();
  }, [isAuthenticated, router, loadStallData]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch(step) {
      case 1: return selectedStalls.length > 0;
      case 2: return true; // Validation handled in component
      case 3: return true;
      default: return false;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Store className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading stall booking system...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Stall Booking</h1>
              <p className="text-emerald-100 text-lg mt-1">Book stalls on behalf of vendors - Direct booking without payment</p>
            </div>
          </div>
          
          {/* Admin Info */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <User className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Booking as: {admin?.name || admin?.username}</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className={`rounded-2xl shadow-xl border p-8 ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-24 right-24 h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between relative">
            {steps.map((s, index) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;

              return (
                <div key={s.id} className="flex flex-col items-center relative z-10 w-32">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-2xl font-bold text-xl transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                        : isActive
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-400 border-2 border-gray-600' 
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <div className={`text-sm font-semibold ${
                      isActive 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : isCompleted 
                        ? 'text-green-600 dark:text-green-400'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {s.title}
                    </div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {s.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className={`rounded-2xl shadow-xl border overflow-hidden ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        {step === 1 && <AdminStallMap />}
        {step === 2 && <AdminVendorDetails />}
        {step === 3 && <AdminStallPayment />}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              step === 1
                ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
                : isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Step {step} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}