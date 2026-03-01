// ShowModal.jsx
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Cinzel } from 'next/font/google';
import PortalModal from './PortalModal';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

function ShowModal({ isOpen, onClose }) {
  return (
    <PortalModal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full rounded-3xl border border-white/50 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 shadow-2xl backdrop-blur-lg"
      >
        {/* Header */}
        <div className="relative p-4 md:p-6 pb-2 md:pb-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-lg hover:shadow-xl z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Title with gradient */}
          <div className="text-center mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl"
            >
              <img 
                src="/show.png" 
                alt="Show" 
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
            </motion.div>
            
            <Link href="/showlayout">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`${cinzel.className} text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3 cursor-pointer hover:scale-105 transition-transform`}
              >
                ✨ Cultural Show ✨
              </motion.h2>
            </Link>
            
            {/* Free Entry Badge */}
            <Link href="/free-pass">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 text-white font-black text-base md:text-lg px-2 md:px-6 py-2 rounded-full shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                  <span className="relative z-10 tracking-wider">🎉 FREE ENTRY 🎉</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-2 md:px-6 pb-2 md:pb-6">
          {/* Welcome Quote */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-2 md:mb-5 p-1 md:p-3 bg-white/60 rounded-2xl shadow-inner"
          >
            <p className={`${playfair.className} text-gray-700 text-base leading-relaxed font-medium italic`}>
              "🎭 Where culture meets celebration, and every moment becomes a memory to cherish forever! 🌟"
            </p>
          </motion.div>
          
          {/* Event Details - Side by side layout */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Duration */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center p-2 pb-8 md:pb-0 md:p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl shadow-sm"
            >
              <div className="text-center">
                <div className="text-xl mb-2">📅</div>
                <div className="text-gray-700 font-semibold pb-2 md:pb-0 text-sm">5 Amazing Days</div>
                <div className="text-blue-600 font-bold text-sm md:text-base">3rd Dec - 7th Dec</div>
              </div>
            </motion.div>
            
            {/* Timing */}
            <Link href="/showlayout">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center p-2 pb-8 md:pb-0 md:p-4 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-xl mb-2">🕐</div>
                  <div className="text-gray-700 font-semibold pb-2 md:pb-0 text-sm">Evening Shows</div>
                  <div className="text-teal-600 font-bold text-sm md:text-base">5:00 PM - 10:00 PM</div>
                </div>
              </motion.div>
            </Link>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl mb-4"
            >
              <p className="text-gray-600 text-sm leading-relaxed">
                🎪 Join us for an unforgettable journey through art, music, and dance! 
                Experience the magic of live performances that will touch your heart and soul. 💫
              </p>
            </motion.div>
            
            <Link href="/showlayout">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
              >
                <div className="flex cursor-pointer items-center justify-center gap-2 text-white font-medium text-sm">
                  <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>View Show Layout</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
        
        {/* Floating particles animation */}
        <div className="absolute top-8 left-10 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce delay-100 pointer-events-none"></div>
        <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-pulse delay-300 pointer-events-none"></div>
        <div className="absolute bottom-16 left-8 w-1 h-1 bg-teal-400/60 rounded-full animate-ping delay-500 pointer-events-none"></div>
        <div className="absolute bottom-24 right-6 w-2.5 h-2.5 bg-blue-300/60 rounded-full animate-bounce delay-700 pointer-events-none"></div>
        
        {/* Decorative stars */}
        <div className="absolute -top-2 -right-2 w-12 h-12 text-yellow-300 opacity-50 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="absolute -bottom-2 -left-2 w-10 h-10 text-amber-300 opacity-40 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </motion.div>
    </PortalModal>
  );
}

export default ShowModal;
