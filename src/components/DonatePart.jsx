import React from 'react';
import Link from 'next/link'; // Adjust import based on your routing library

const DonationPart = () => {
  return (
    <Link href="/donate" className="block mx-1 md:mx-4 my-2">
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-orange-500 to-red-500 py-2 px-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer">
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:15px_15px] animate-pulse"></div>
        </div>
        
        {/* Floating sparkles - reduced */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
          <div className="absolute top-3 right-6 w-1 h-1 bg-yellow-200 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
          <div className="absolute bottom-2 right-4 w-1 h-1 bg-yellow-200 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '2s'}}></div>
        </div>

        {/* Glowing border effect - subtle */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-400 via-orange-400 to-red-400 opacity-50 blur-lg animate-pulse"></div>
        
        {/* Content - Flex with wrap on mobile */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Left text */}
          <div className="flex items-center justify-center sm:justify-start gap-1">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center animate-spin flex-shrink-0" style={{animationDuration: '3s'}}>
              <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
            
            <p className="font-bold text-white text-xs sm:text-sm text-center">
              Your kindness can change a life
            </p>
            
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
              <div className="w-2.5 h-2.5 bg-red-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Donate Button */}
          <div className="inline-flex items-center justify-center gap-1 bg-white/95 hover:bg-white text-rose-600 font-bold py-1.5 px-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex-shrink-0">
            <span className="text-sm">💝</span>
            <span className="text-xs sm:text-sm whitespace-nowrap">Donate Now</span>
            <span className="text-sm">🙏</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </Link>
  );
};

export default DonationPart;