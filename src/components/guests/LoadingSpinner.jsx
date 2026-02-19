"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0b14] via-[#1a0f1d] to-[#140b18] 
                    flex items-center justify-center relative overflow-hidden">
      
      {/* Rain Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-12 bg-gradient-to-b from-transparent via-amber-400/20 to-transparent"
            initial={{ x: Math.random() * window.innerWidth, y: -100 }}
            animate={{ y: window.innerHeight + 100 }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Animated Lotus */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-6xl mb-4"
        >
          🌸
        </motion.div>

        {/* Loading Text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-amber-300/80 text-lg mt-4"
        >
          Gathering sacred memories...
        </motion.p>

        {/* Decorative Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-amber-500/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}