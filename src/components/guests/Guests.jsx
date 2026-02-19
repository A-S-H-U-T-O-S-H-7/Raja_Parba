


"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Poppins, Quicksand } from 'next/font/google';
import GuestCard from '@/components/guests/GuestCard';
import GuestBanner from '@/components/guests/GuestBanner';
import { getGuests } from '@/lib/guestService';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const result = await getGuests();
      if (result.success) {
        setGuests(result.data);
      }
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter guests by category
  const filteredGuests = selectedCategory === 'all' 
    ? guests 
    : guests.filter(guest => guest.category === selectedCategory);

  // Group guests by category
  const spiritualGuests = guests.filter(g => g.category === 'spiritual');
  const artistGuests = guests.filter(g => g.category === 'artist');
  const specialGuests = guests.filter(g => g.category === 'special');

  // Category colors - each with its own family
  const categories = [
    { 
      id: 'all', 
      label: 'All Friends', 
      icon: '🌈', 
      gradient: 'from-purple-400 to-pink-400',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200'
    },
    { 
      id: 'spiritual', 
      label: 'Soulful Souls', 
      icon: '🕊️', 
      gradient: 'from-blue-400 to-cyan-400',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200'
    },
    { 
      id: 'artist', 
      label: 'Creative Hearts', 
      icon: '🎨', 
      gradient: 'from-orange-400 to-amber-400',
      bgLight: 'bg-orange-50',
      border: 'border-orange-200'
    },
    { 
      id: 'special', 
      label: 'Special Ones', 
      icon: '✨', 
      gradient: 'from-emerald-400 to-teal-400',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-6xl mb-4"
          >
            🌸
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cyan-600 font-medium"
          >
            Gathering lovely memories...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      
      {/* Happy Floating Elements - Color coordinated */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { emoji: '🌸', color: 'text-pink-200' },
          { emoji: '🌼', color: 'text-yellow-200' },
          { emoji: '🦋', color: 'text-blue-200' },
          { emoji: '🌈', color: 'text-purple-200' },
          { emoji: '☀️', color: 'text-orange-200' },
          { emoji: '⭐', color: 'text-amber-200' },
          { emoji: '🕊️', color: 'text-cyan-200' },
          { emoji: '✨', color: 'text-emerald-200' },
        ].map((item, i) => (
          <motion.div
            key={`float-${i}`}
            className={`absolute text-3xl md:text-4xl ${item.color} opacity-40`}
            style={{
              left: `${5 + i * 11}%`,
              top: `${10 + i * 7}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Soft Color Blobs - Each in its own color family */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-4000" />
      <div className="absolute bottom-40 right-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-3000" />

      {/* Main Content */}
      <div className="relative z-10">
        <GuestBanner />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Category Pills - Colorful and Fun */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {categories.map((category, index) => {
              const isSelected = selectedCategory === category.id;
              const categoryColors = {
                all: 'from-purple-400 to-pink-400',
                spiritual: 'from-blue-400 to-cyan-400',
                artist: 'from-orange-400 to-amber-400',
                special: 'from-emerald-400 to-teal-400'
              };
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 shadow-md
                    ${isSelected 
                      ? `bg-gradient-to-r ${categoryColors[category.id]} text-white shadow-lg` 
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-lg border border-gray-200'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                    {category.id !== 'all' && (
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs
                        ${isSelected ? 'bg-white/30' : 'bg-gray-100'}`}>
                        {category.id === 'spiritual' ? spiritualGuests.length :
                         category.id === 'artist' ? artistGuests.length :
                         specialGuests.length}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Guests Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredGuests.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GuestCard guest={guest} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredGuests.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-blue-100"
            >
              <div className="text-6xl mb-4">🌈</div>
              <h3 className={`${poppins.className} text-2xl text-cyan-600 mb-2`}>No guests found</h3>
              <p className="text-gray-500">But more lovely people will join us soon!</p>
            </motion.div>
          )}

          {/* Happy Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 pt-8"
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-2xl">🎉</span>
              <span className="text-gray-500">Celebrating the beautiful souls in Raja's journey</span>
              <span className="text-2xl">✨</span>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {['❤️', '🧡', '💛', '💚', '💙', '💜'].map((heart, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                  className="text-xl"
                >
                  {heart}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-15px, 20px) scale(0.95); }
          75% { transform: translate(10px, -15px) scale(1.05); }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
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
    </div>
  );
}