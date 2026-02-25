// HeroActions.jsx
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, Users, Mic, Calendar, Sparkles, Award, Crown, Sparkle } from 'lucide-react';
import { Playfair_Display, Cinzel } from 'next/font/google';
import ShowModal from "./ShowModal";
import { createSponsorApplication, createPerformerApplication } from '@/services/sponsorPerformerService';
import SponsorModal from "../sponsor-perfomer/SponsorModal";
import PerformerModal from "../sponsor-perfomer/PerformerModal";
import ToastNotification from "../sponsor-perfomer/ToastNotification";
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
  
  // Sponsor Modal State
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    address: '',
    city: ''
  });
  
  // Performer Modal State
  const [showPerformerModal, setShowPerformerModal] = useState(false);
  const [performerForm, setPerformerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    performanceCategory: '',
    customPerformanceType: '',
    performanceType: '',
    participationType: '',
    groupName: '',
    memberCount: '',
    memberNames: [],
    trackMusicName: ''
  });
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const openShowModal = () => setIsShowModalOpen(true);
  const closeShowModal = () => setIsShowModalOpen(false);
  
  const openSponsorModal = () => setShowSponsorModal(true);
  const openPerformerModal = () => setShowPerformerModal(true);

  // Handle action for non-authenticated users
  const handleAction = (action) => {
    if (!user) {
      setPendingAction(action);
      setShowLoginPrompt(true);
    } else {
      if (action === 'sponsor') openSponsorModal();
      else if (action === 'performer') openPerformerModal();
      else if (action === 'show') openShowModal();
      else if (action === 'stall') window.location.href = '/stall';
      else if (action === 'awards') window.location.href = '/awards';
      else if (action === 'kumari') window.location.href = '/raja-kumari';
      else if (action === 'fancy-dress') window.location.href = '/fancy-dress';
    }
  };

  const handleSponsorSubmit = async () => {
    if (sponsorForm.name && sponsorForm.email && sponsorForm.phone && sponsorForm.organization && sponsorForm.address && sponsorForm.city) {
      try {
        const result = await createSponsorApplication(sponsorForm);
        
        // Send confirmation email
        try {
          const { sendSponsorConfirmationEmail } = await import('@/services/emailService');
          const emailResult = await sendSponsorConfirmationEmail(sponsorForm);
          console.log('📧 Sponsor email sent:', emailResult.success ? 'Success' : emailResult.error);
        } catch (emailError) {
          console.error('❌ Failed to send sponsor email:', emailError);
        }
        
        showToastMessage("Thank you for your interest in sponsoring! Our partnership team will reach out to you within 24 hours to discuss exciting collaboration opportunities.");
        setSponsorForm({ name: '', email: '', phone: '', organization: '', address: '', city: '' });
        setShowSponsorModal(false);
      } catch (error) {
        console.error('Error submitting sponsor application:', error);
        showToastMessage("Sorry, there was an error submitting your application. Please try again later.");
      }
    }
  };

  const handlePerformerSubmit = async () => {
    const resolvedPerformanceType =
      performerForm.performanceCategory === 'Others'
        ? (performerForm.customPerformanceType || '').trim()
        : (performerForm.performanceCategory || '').trim();

    const isGroup = performerForm.participationType === 'Group';
    const memberCount = Number(performerForm.memberCount || 0);

    const isFormValid =
      (performerForm.name || '').trim() &&
      (performerForm.email || '').trim() &&
      (performerForm.phone || '').trim() &&
      (performerForm.address || '').trim() &&
      (performerForm.gender || '').trim() &&
      (performerForm.participationType || '').trim() &&
      (performerForm.trackMusicName || '').trim() &&
      resolvedPerformanceType &&
      (!isGroup || ((performerForm.groupName || '').trim() && memberCount > 0));

    if (isFormValid) {
      const performerPayload = {
        ...performerForm,
        performanceType: resolvedPerformanceType,
        groupName: isGroup ? performerForm.groupName : '',
        memberCount: isGroup ? String(memberCount) : '',
        memberNames: isGroup ? (performerForm.memberNames || []) : [],
      };

      try {
        const result = await createPerformerApplication(performerPayload);
        
        // Send confirmation email
        try {
          const { sendPerformerConfirmationEmail } = await import('@/services/emailService');
          const emailResult = await sendPerformerConfirmationEmail(performerPayload);
          console.log('📧 Performer email sent:', emailResult.success ? 'Success' : emailResult.error);
        } catch (emailError) {
          console.error('❌ Failed to send performer email:', emailError);
        }
        
        showToastMessage("We're thrilled about your performance application! Our talent acquisition team will contact you soon to discuss your artistic journey with us.");
        setPerformerForm({
          name: '',
          email: '',
          phone: '',
          address: '',
          gender: '',
          performanceCategory: '',
          customPerformanceType: '',
          performanceType: '',
          participationType: '',
          groupName: '',
          memberCount: '',
          memberNames: [],
          trackMusicName: ''
        });
        setShowPerformerModal(false);
      } catch (error) {
        console.error('Error submitting performer application:', error);
        showToastMessage("Sorry, there was an error submitting your application. Please try again later.");
      }
    }
  };

  const cards = [
    {
      id: 'sponsor',
      title: 'Be a Sponsor',
      description: 'Partner with us',
      icon: Star,
      gradient: 'from-amber-500 to-orange-500',
      lightGradient: 'from-amber-50 to-orange-50',
      borderColor: 'amber',
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
      borderColor: 'purple',
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
      borderColor: 'blue',
      image: '/show.png',
      action: 'show'
    },
    {
      id: 'stall',
      title: 'Stall Booking',
      description: 'Reserve your stall',
      icon: Heart,
      gradient: 'from-purple-500 to-pink-500',
      lightGradient: 'from-purple-50 to-pink-50',
      borderColor: 'pink',
      image: '/stall.png',
      action: 'stall',
      isLink: true
    },
    {
      id: 'awards',
      title: 'Awards Nomination',
      description: 'Nominate yourself',
      icon: Award,
      gradient: 'from-yellow-500 to-amber-500',
      lightGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'yellow',
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
      borderColor: 'rose',
      image: '/rajaqueen.png',
      action: 'kumari'
    },
    {
      id: 'fancy-dress',
      title: 'Fancy Dress',
      description: 'Show your style',
      icon: Sparkle,
      gradient: 'from-emerald-500 to-teal-500',
      lightGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'emerald',
      image: '/fancy.png',
      action: 'fancy-dress'
    }
  ];

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

      {/* Top Border */}
      <div
        className="absolute top-0 left-0 w-full h-4 bg-repeat-x bg-center opacity-95"
        style={{
          backgroundImage: 'url(/goldenborder.png)',
          backgroundSize: 'auto 100%',
        }}
      />

      {/* Optimized Floating Particles - CSS Animations instead of Framer Motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <style jsx>{`
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
      <div className="relative z-10 max-w-7xl mx-auto">
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

        {/* Cards Grid - Smaller boxes, 2 columns on mobile, 4 on tablet, 7 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Main Card */}
                <div className={`relative bg-gradient-to-br ${card.lightGradient} backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-${card.borderColor}-200/50 group-hover:-translate-y-0.5`}>
                  
                  {/* Top Gradient Bar */}
                  <div className={`h-1 bg-gradient-to-r ${card.gradient}`}></div>
                  
                  {/* Card Content - Smaller padding */}
                  <div className="p-3 flex flex-col items-center">
                    
                    {/* Icon/Image Container - Smaller */}
                    <div className="relative mb-2">
                      {/* Outer Glow Ring */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300`}></div>
                      
                      {/* Image Container - Smaller */}
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

                      {/* Floating Icon Overlay - Smaller */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-md`}>
                        <IconComponent className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                    </div>

                    {/* Title - Smaller text */}
                    <h3 className={`${playfair.className} text-xs sm:text-sm font-bold text-gray-800 mb-1 text-center line-clamp-1`}>
                      {card.title}
                    </h3>

                    {/* Description - Smaller text */}
                    <p className="text-[10px] sm:text-xs text-gray-600 text-center mb-2 line-clamp-1">
                      {card.description}
                    </p>

                    {/* Decorative Line - Smaller */}
                    <div className={`w-8 h-0.5 bg-gradient-to-r from-transparent via-${card.borderColor}-500 to-transparent mb-2`}></div>

                    {/* Action Button - Smaller */}
                    {card.isLink ? (
                      <Link
                        href={user ? card.action === 'stall' ? "/stall" : `/${card.action}` : "#"}
                        onClick={(e) => {
                          if (!user) {
                            e.preventDefault();
                            handleAction(card.action);
                          }
                        }}
                        className={`w-full bg-gradient-to-r ${card.gradient} text-white py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1 group/btn`}
                      >
                        <span>{user ? "Book" : "Join"}</span>
                        <svg className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAction(card.action)}
                        className={`w-full bg-gradient-to-r ${card.gradient} text-white py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1 group/btn`}
                      >
                        <span>{user ? "Apply" : "Join"}</span>
                        <svg className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Login Prompt Modal - Using PortalModal */}
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
        
        <SponsorModal 
          showSponsorModal={showSponsorModal}
          setShowSponsorModal={setShowSponsorModal}
          sponsorForm={sponsorForm}
          setSponsorForm={setSponsorForm}
          handleSponsorSubmit={handleSponsorSubmit}
        />

        <PerformerModal 
          showPerformerModal={showPerformerModal}
          setShowPerformerModal={setShowPerformerModal}
          performerForm={performerForm}
          setPerformerForm={setPerformerForm}
          handlePerformerSubmit={handlePerformerSubmit}
        />

        <ToastNotification 
          showToast={showToast}
          toastMessage={toastMessage}
        /> 
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
      `}</style>

      {/* Corner Design - overflow only in y-direction */}
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