// HeroActions.jsx
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, Users, Mic, Calendar, Sparkles, Award, Crown, Sparkle, Cake } from 'lucide-react';
import { Playfair_Display, Cinzel } from 'next/font/google';
import ShowModal from "./ShowModal";
import PortalModal from "./PortalModal";

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

function HeroActions({ user }) {
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  

  // Handle scroll to optimize animations
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolling(false), 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const openShowModal = () => setIsShowModalOpen(true);
  const closeShowModal = () => setIsShowModalOpen(false);
  

  // Handle action for non-authenticated users
  const handleAction = (action) => {
    if (!user) {
      setPendingAction(action);
      setShowLoginPrompt(true);
    } else {
      if (action === 'sponsor') window.location.href = '/sponsor';
      else if (action === 'performer') window.location.href = '/performer';
      else if (action === 'raja-queen') window.location.href = '/raja-queen';
      else if (action === 'poda-pitha') window.location.href = '/poda-pitha';
      else if (action === 'drawing') window.location.href = '/drawing';
      else if (action === 'awards') window.location.href = '/award';
      else if (action === 'show') window.location.href = '/show';
      else if (action === 'stall') window.location.href = '/stall';
      else if (action === 'kumari') window.location.href = '/raja-kumari';
      else if (action === 'fancy-dress') window.location.href = '/fancy-dress';
    }
  };

  // Cards with static classes (no dynamic template literals for Tailwind)
  const cards = [
  {
    id: 'sponsor',
    title: 'Be a Sponsor',
    description: 'Partner with us',
    icon: Star,
    gradient: 'from-amber-500 to-orange-500',
    lightGradient: 'from-amber-50 to-orange-50',
    borderClass: 'border-amber-200/50',
    viaColor: 'via-amber-500',
    image: '/sponser.png',
    action: 'sponsor'
  },
  {
    id: 'performer',
    title: 'Join as Performer',
    description: 'Showcase talent',
    icon: Mic,
    gradient: 'from-fuchsia-500 to-purple-500',
    lightGradient: 'from-fuchsia-50 to-purple-50',
    borderClass: 'border-purple-200/50',
    viaColor: 'via-purple-500',
    image: '/performer.png',
    action: 'performer'
  },
  {
    id: 'show',
    title: 'Show Booking',
    description: 'Book tickets now',
    icon: Calendar,
    gradient: 'from-blue-500 to-cyan-500',
    lightGradient: 'from-blue-50 to-cyan-50',
    borderClass: 'border-blue-200/50',
    viaColor: 'via-blue-500',
    image: '/show.png',
    action: 'show',
    featured: true,
    featuredBorderClass: 'border-blue-400',
    featuredFocusClass: 'focus-visible:ring-blue-400'
  },
  {
    id: 'stall',
    title: 'Stall Booking',
    description: 'Reserve your stall',
    icon: Heart,
    gradient: 'from-purple-500 to-pink-500',
    lightGradient: 'from-purple-50 to-pink-50',
    borderClass: 'border-pink-600/50',
    viaColor: 'via-pink-500',
    image: '/stall.png',
    action: 'stall',
    isLink: true,
    featured: true,
    featuredBorderClass: 'border-fuchsia-400',
    featuredFocusClass: 'focus-visible:ring-fuchsia-400'
  },
  {
    id: 'awards',
    title: 'Awards',
    description: 'Nominate yourself',
    icon: Award,
    gradient: 'from-yellow-500 to-amber-500',
    lightGradient: 'from-yellow-50 to-amber-50',
    borderClass: 'border-yellow-200/50',
    viaColor: 'via-yellow-500',
    image: '/awards.png',
    action: 'awards'
  },
  {
    id: 'kumari',
    title: 'Raja Kumari',
    description: 'Royal contest',
    icon: Crown,
    gradient: 'from-rose-500 to-red-500',
    lightGradient: 'from-rose-50 to-red-50',
    borderClass: 'border-rose-200/50',
    viaColor: 'via-rose-500',
    image: '/rajaqueen.png',
    action: 'kumari'
  },
  {
    id: 'raja-queen',
    title: 'Raja Queen',
    description: 'Elegance & grace',
    icon: Crown,
    gradient: 'from-pink-500 to-purple-500',
    lightGradient: 'from-pink-50 to-purple-50',
    borderClass: 'border-pink-200/50',
    viaColor: 'via-pink-500',
    image: '/rajaqueen.png',
    action: 'raja-queen'
  },
  {
    id: 'poda-pitha',
    title: 'Poda Pitha',
    description: 'Traditional cake contest',
    icon: Cake,
    gradient: 'from-blue-700 to-indigo-900',
    lightGradient: 'from-blue-50 to-indigo-100',
    borderClass: 'border-blue-300/60',
    viaColor: 'via-blue-700',
    image: '/podapitha2.png',
    action: 'poda-pitha'
  },
  {
    id: 'drawing',
    title: 'Drawing',
    description: 'Show your creativity',
    icon: Sparkle,
    gradient: 'from-emerald-500 to-teal-500',
    lightGradient: 'from-emerald-50 to-teal-50',
    borderClass: 'border-emerald-200/50',
    viaColor: 'via-emerald-500',
    image: '/drawing.jpg',
    action: 'drawing'
  }
];

  const firstRowCards = cards.slice(0, 5);
  const secondRowCards = cards.slice(5);

  // Generate random values for particles that stay consistent
  const particles = [...Array(6)].map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 2,
    size: 0.8 + Math.random() * 1.2
  }));

  return (
    <div className="relative w-full py-10 md:py-14 px-4 overflow-x-clip overflow-y-visible bg-gradient-to-br from-teal-300 via-white to-emerald-400">
      
      {/* Bubble Background - Optimized */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-4 w-34 h-34 bg-purple-300 rounded-full opacity-80 animate-blob will-change-transform"></div>
        <div className="absolute top-0 -right-4 w-22 h-22 bg-yellow-300 rounded-full opacity-70 animate-blob animation-delay-2000 will-change-transform"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 will-change-transform"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-3000 will-change-transform"></div>
      </div>

      

      {/* Optimized Floating Particles - CSS Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`particle ${
              particle.size > 1.5 ? 'particle-large' : 
              particle.size < 1 ? 'particle-small' : ''
            } ${isScrolling ? 'animation-paused' : ''}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative py-5 z-10 max-w-7xl mx-auto">
        {/* Header Section with New Fonts */}
        <div className="text-center mb-6 md:mb-8">
          
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`${playfair.className} text-xl sm:text-2xl md:text-4xl text-amber-800 mb-2 drop-shadow-sm`}
          >
            Celebrate Raja Parba 2026
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm md:text-base text-gray-700 max-w-3xl mx-auto"
          >
            Join Odisha&apos;s grand festival of swings, songs, tradition, and joyful community spirit.
          </motion.p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-0.5 w-10 bg-amber-400/80 rounded-full"></div>
            <div className="h-1 w-16 bg-red-500/80 rounded-full"></div>
            <div className="h-0.5 w-10 bg-amber-400/80 rounded-full"></div>
          </div>
        </div>

        {/* Cards Grid */}
        {[firstRowCards, secondRowCards].map((rowCards, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid grid-cols-2 sm:grid-cols-3 ${rowIndex === 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 md:gap-4 ${rowIndex === 0 ? 'mb-3 md:mb-4' : ''}`}
          >
            {rowCards.map((card, index) => {
              const IconComponent = card.icon;
              const animationIndex = rowIndex === 0 ? index : index + firstRowCards.length;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: animationIndex * 0.05 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

                  <div className={`relative h-full bg-gradient-to-br ${card.lightGradient} backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${card.borderClass} group-hover:-translate-y-0.5 ${
                    card.featured ? `border-2 ${card.featuredBorderClass} ring-1 ring-white/70 shadow-lg` : ''
                  }`}>
                    <div className={`h-1 bg-gradient-to-r ${card.gradient}`}></div>

                    <div className="p-3 flex h-full flex-col items-center">
                      <div className="relative mb-2">
                        <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300`}></div>

                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${card.gradient} p-1 shadow-md`}>
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1.5">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/32?text=${card.title.charAt(0)}`;
                              }}
                            />
                          </div>
                        </div>

                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-md`}>
                          <IconComponent className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                        </div>
                      </div>

                      <h3 className={`${playfair.className} text-xs sm:text-sm font-bold text-gray-800 mb-1 text-center line-clamp-1`}>
                        {card.title}
                      </h3>

                      <p className="text-[10px] sm:text-xs text-gray-600 text-center mb-2 line-clamp-1">
                        {card.description}
                      </p>

                      <div className={`w-8 h-0.5 bg-gradient-to-r from-transparent ${card.viaColor} to-transparent mb-2`}></div>

                      <div className="mt-auto w-full">
                        {card.isLink ? (
                          <Link
                            href={user ? card.action === 'stall' ? "/stall" : `/${card.action}` : "#"}
                            onClick={(e) => {
                              if (!user) {
                                e.preventDefault();
                                handleAction(card.action);
                              }
                            }}
                            className={`w-full bg-gradient-to-r ${card.gradient} text-white py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              card.featured ? card.featuredFocusClass : 'focus-visible:ring-purple-400'
                            }`}
                          >
                            <span>{user ? "Book" : "Join"}</span>
                            <svg className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleAction(card.action)}
                            className={`w-full bg-gradient-to-r ${card.gradient} text-white py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              card.featured ? card.featuredFocusClass : 'focus-visible:ring-purple-400'
                            }`}
                          >
                            <span>{user ? "Apply" : "Join"}</span>
                            <svg className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* Login Prompt Modal */}
        <PortalModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-full"></div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className={`${cinzel.className} text-xl font-bold text-center text-gray-800 mb-2`}>
              Join the Celebration!
            </h3>

            <p className={`${playfair.className} text-sm text-gray-600 text-center mb-6`}>
              Please login or register to {pendingAction === 'sponsor' ? 'become a sponsor' : 
                pendingAction === 'performer' ? 'join as a performer' : 
                pendingAction === 'show' ? 'book show tickets' : 
                pendingAction === 'awards' ? 'nominate for awards' :
                pendingAction === 'kumari' ? 'participate in Raja Kumari' :
                pendingAction === 'raja-queen' ? 'participate in Raja Queen' :
                pendingAction === 'poda-pitha' ? 'join the Poda Pitha competition' :
                pendingAction === 'drawing' ? 'join drawing competition' :
                pendingAction === 'fancy-dress' ? 'join fancy dress' : 'book a stall'}
            </p>

            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowLoginPrompt(false)}
              >
                Register Now
              </Link>
              
              <Link
                href="/login"
                className="block w-full bg-white border-2 border-red-600 text-red-600 py-3 px-4 rounded-xl font-semibold text-center hover:bg-red-600 hover:text-white transition-all duration-300"
                onClick={() => setShowLoginPrompt(false)}
              >
                Login
              </Link>

              <button
                onClick={() => setShowLoginPrompt(false)}
                className="block w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
              >
                Continue Browsing
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <Sparkles className="w-4 h-4 text-red-500" />
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </PortalModal>

        {/* Modals */}
        <ShowModal isOpen={isShowModalOpen} onClose={closeShowModal} />
        
      </div>

      {/* Combined Style Tag */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translate(8px, -12px) scale(1.2);
            opacity: 0.5;
          }
          50% {
            transform: translate(-5px, -20px) scale(1.4);
            opacity: 0.7;
          }
          75% {
            transform: translate(10px, -12px) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: rgba(250, 204, 21, 0.3);
          border-radius: 9999px;
          box-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
          animation: float-particle infinite ease-in-out;
          will-change: transform, opacity;
        }
        
        .particle-large {
          width: 8px;
          height: 8px;
          background-color: rgba(250, 204, 21, 0.4);
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.4);
        }
        
        .particle-small {
          width: 4px;
          height: 4px;
          background-color: rgba(250, 204, 21, 0.2);
          box-shadow: 0 0 8px rgba(250, 204, 21, 0.2);
        }
        
        .animation-paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Corner Design */}
      <div className="absolute -bottom-5 left-[-20px] md:-bottom-14 md:left-[-30px] w-28 h-28 md:w-56 md:h-56 z-20 pointer-events-none">
        <Image
          src="/greencorner.png"
          alt="corner design"
          fill
          className="object-contain object-bottom"
        />
      </div>
      <div className="absolute -bottom-5 right-[-20px] md:-bottom-14 md:right-[-30px] w-28 h-28 md:w-56 md:h-56 z-20 pointer-events-none">
        <Image
          src="/greencorner.png"
          alt="corner design"
          fill
          className="object-contain object-bottom scale-x-[-1]"
        />
      </div>
    </div>
  );
}

export default HeroActions;
