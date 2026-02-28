import { Heart, Users, Globe, ArrowRightCircle, HandHeart } from 'lucide-react';
import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-rose-900 to-purple-900 text-white rounded-2xl mb-5 mx-0 md:mx-15 shadow-2xl">
      
      {/* Main Container - Flex column on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row">
        
        {/* Left Side - Image - Reduced height on mobile */}
        <div className="relative w-full md:w-2/5 h-36 md:h-auto overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none group">
          <Image
            src="/donation.jpg"
            alt="Donation impact"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          
          {/* Gradient Overlay - Adjusted for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-900/90 md:bg-gradient-to-r md:from-amber-900/90 md:via-amber-900/30 md:to-transparent"></div>
          
          {/* Mobile-only overlay text - Shows on image */}
          <div className="absolute bottom-2 left-2 right-2 md:hidden">
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-rose-400" fill="currentColor" />
              <span className="text-xs font-medium">Your Gift Matters</span>
            </div>
          </div>
          
          {/* Desktop decorative element */}
          <div className="hidden md:block absolute bottom-4 left-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
              <span className="text-sm font-medium">Your Gift Matters</span>
            </div>
          </div>
          
          {/* Corner Accent */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/60"></div>
        </div>
        
        {/* Right Side - Content - Compact on mobile */}
        <div className="relative w-full md:w-3/5 py-4 md:py-8 px-4 md:px-8">
          
          {/* Background Pattern - Subtle */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl">
            
            {/* Header - Compact on mobile */}
            <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 md:p-3">
                <Heart className="w-4 h-4 md:w-7 md:h-7 text-rose-300" fill="currentColor" />
              </div>
              <div>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Make a Difference
                </h2>
                <p className="text-xs md:text-base text-white/70 hidden sm:block">
                  Your contribution creates lasting impact
                </p>
              </div>
            </div>
            
            {/* Mobile-only tagline */}
            <p className="text-xs text-white/70 mb-3 sm:hidden">
              Your contribution creates lasting impact
            </p>
            
            {/* Stats - Compact grid on mobile */}
            <div className="grid grid-cols-3 gap-1 md:gap-3 mb-3 md:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-1.5 md:p-3 text-center">
                <Users className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-0.5 md:mb-1 text-amber-300" />
                <span className="text-xs md:text-base font-semibold block">1K+</span>
                <span className="text-[8px] md:text-xs text-white/60">Lives</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-1.5 md:p-3 text-center">
                <Globe className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-0.5 md:mb-1 text-amber-300" />
                <span className="text-xs md:text-base font-semibold block">50+</span>
                <span className="text-[8px] md:text-xs text-white/60">Communities</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-1.5 md:p-3 text-center">
                <Heart className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-0.5 md:mb-1 text-amber-300" />
                <span className="text-xs md:text-base font-semibold block">10K+</span>
                <span className="text-[8px] md:text-xs text-white/60">Supporters</span>
              </div>
            </div>
            
            {/* CTA Section - Compact */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
              <button className="group bg-gradient-to-r from-amber-500 to-rose-500  text-white font-semibold py-2 md:py-3 px-4 md:px-8 rounded-full text-xs md:text-base shadow-lg  transition-all duration-300 transform  flex items-center justify-center gap-1 md:gap-2">
                Donate Now
                <ArrowRightCircle className="w-3 h-3 md:w-5 md:h-5  transition-transform" />
              </button>
              
              
            </div>
            
            {/* Trust Badges - Compact */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] md:text-xs text-white/40">
              <span className="flex items-center gap-0.5">
                <span className="text-amber-400">✓</span> Secure
              </span>
              <span className="flex items-center gap-0.5">
                <span className="text-amber-400">✓</span> Tax Exempted
              </span>
              <span className="flex items-center gap-0.5">
                <span className="text-amber-400">✓</span> Transparent
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500"></div>
    </div>
  );
}