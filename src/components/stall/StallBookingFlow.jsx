// components/stall/StallBookingFlow.jsx
"use client";
import { useEffect } from 'react';
import { Store, UserCheck, CreditCard, Check } from 'lucide-react';
import useUserStallBookingStore from '@/lib/stores/useUserStallBookingStore';
import { useStallCleanup } from '@/hooks/useStallCleanup';
import StallMap from './StallMap';
import VendorDetails from './VendorDetails';
import StallPaymentProcess from './StallPaymentProcess';
import DonateBar from '../donation/DonationBar';

export default function StallBookingFlow() {
  useStallCleanup();

  const { 
    currentStep,
    nextStep,
    prevStep,
    selectedStalls,
    initializeListeners,
    cleanupListeners
  } = useUserStallBookingStore();

  useEffect(() => {
    initializeListeners();
    return () => cleanupListeners();
  }, [initializeListeners, cleanupListeners]);

  const steps = [
    { id: 1, title: 'Choose Stalls', subtitle: 'Select your locations', icon: Store },
    { id: 2, title: 'Vendor Details', subtitle: 'Business information', icon: UserCheck },
    { id: 3, title: 'Payment', subtitle: 'Complete booking', icon: CreditCard }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <StallMap />;
      case 2: return <VendorDetails />;
      case 3: return <StallPaymentProcess />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-2 py-4 md:py-8">
        <div className="max-w-7xl pb-5 md:pb-10 mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative bg-gradient-to-br from-purple-200 via-white to-purple-200 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
              
              {/* Stall Design Border */}
              <div 
                className="w-full h-6 sm:h-8 bg-repeat-x bg-center"
                style={{
                  backgroundImage: 'url(/stalldesign.png)',
                  backgroundSize: 'auto 100%'
                }}
              ></div>
              
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/10 to-pink-400/5"></div>
              
              <div className="px-3 md:px-4 py-8 md:py-13">
                <div className="flex items-center justify-between gap-2 max-w-6xl mx-auto">
                  
                  {/* Left Image */}
                  <div className="hidden lg:block flex-shrink-0">
                    <img 
                      src="/stall4.png" 
                      alt="Stall" 
                      className="w-24 h-24 lg:w-75 lg:h-75 object-contain"
                    />
                  </div>

                  {/* Center Content */}
                  <div className="text-center flex-1 min-w-0">
                    <div className="flex justify-center items-center mb-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/60 backdrop-blur-sm shadow-xl flex items-center justify-center border border-blue-300">
                        <img 
                          src="/stall3.jpg" 
                          alt="Stall" 
                          className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-full"
                        />
                      </div>
                    </div>

                    <div className='w-full max-w-sm mx-auto mb-3'>
                      <DonateBar/>
                    </div>
                    
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Pick Your Stall
                    </h1>
                    
                    <p className="text-gray-700 text-sm md:text-base max-w-xl mx-auto mb-3">
                      Secure your premium business space for the 5-day grand event
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-full border border-green-200/50 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">Prime Locations</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200/50 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">5-Day Event Pass</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-full border border-purple-200/50 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">Premium Amenities</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="hidden lg:block flex-shrink-0">
                    <img 
                      src="/stallimg.png" 
                      alt="Stall" 
                      className="w-24 h-24 lg:w-60 lg:h-60 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            {/* Mobile Progress */}
            <div className="block md:hidden">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-center mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-2 shadow-md">
                    {(() => {
                      const Icon = steps[currentStep - 1].icon;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">{steps[currentStep - 1].title}</h3>
                  <p className="text-xs text-gray-600">{steps[currentStep - 1].subtitle}</p>
                </div>
                <div className="flex items-center justify-center space-x-1.5 mb-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index + 1 <= currentStep ? 'bg-blue-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500">Step {currentStep} of {steps.length}</p>
              </div>
            </div>
            
            {/* Desktop Progress */}
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between relative px-6">
                  <div className="absolute top-6 left-12 right-12 h-0.5 bg-gray-200">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 rounded-full"
                      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                  </div>
                  
                  {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center relative z-10">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all duration-300 ${
                            isCompleted
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg'
                              : isActive
                              ? 'bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg scale-110'
                              : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                          }`}
                        >
                          {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        </div>
                        <div className="mt-3 text-center">
                          <div className={`text-sm font-semibold ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </div>
                          <div className={`text-xs ${
                            isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-300 p-2 md:p-4 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                ← Previous
              </button>

              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Step {currentStep} of {steps.length}</span>
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === 3}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto ${
                  currentStep === 3
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
