"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';

function Layout({ children }) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      {/* Header */}
      <header className="w-full relative sticky top-0 z-50">
        {/* Corner Design */}
        <div className="absolute overflow-visible top-0 left-0 md:top-[-5px] md:left-0 w-24 h-24 md:w-42 md:h-42 z-20">
          <Image
            src="/headercorner.png"
            alt="corner design"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-0 right-[-10px] md:top-[-5px] md:right-0 w-24 h-24 md:w-42 md:h-42 z-20">
          <Image
            src="/headercorner.png"
            alt="corner design"
            fill
            className="object-contain scale-x-[-1]"
          />
        </div>

        {/* Decorative Top Border with Marigold Pattern */}
        <div className="bg-[url('/samborder.png')] bg-repeat-x w-full h-6 bg-[size:auto_24px]" />
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 h-7 w-full shadow-inner relative overflow-hidden">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
        </div>

        {/* Main Navbar */}
        <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 shadow-lg border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo Section with Text - Now with overflow downward */}
              <div className="flex items-center gap-4 relative group">
                {/* Logo with overflow - extends below */}
                <div className="flex-shrink-0 relative mb-[-5px] md:mb-[-10px]">
                  <div className="w-18 h-18 md:w-24 md:h-24 relative bg-gradient-to-br from-rose-400 to-red-500 rounded-full p-0.5 border border-rose-300 shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
                      <Image
                        src="/raja-logo.png"
                        alt="Raja Mahotsav Logo"
                        fill
                        className="object-contain rounded-full p-1"
                      />
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative dot */}
                  <div className="absolute -bottom-1 right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                </div>
                
                {/* Text next to logo */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-rose-700 via-red-600 to-amber-700 bg-clip-text text-transparent">
                      Raja Parba
                    </span>
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                  </div>
                  <span className="text-lg md:text-2xl font-semibold text-amber-600 relative">
                    2026
                  </span>
                </div>
              </div>

              {/* Back Button - Enhanced */}
              <div className="flex items-center">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-amber-400/50 group relative overflow-hidden"
                  aria-label="Go back"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  
                  <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm md:text-base relative z-10">Back</span>
                  
                  {/* Decorative elements */}
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
                  <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-300 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom shadow */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
      </header>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {children}
    </div>
  );
}

export default Layout;