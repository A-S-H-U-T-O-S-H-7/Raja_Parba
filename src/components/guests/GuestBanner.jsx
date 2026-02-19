"use client";

import React from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Cinzel, Cormorant_Garamond, Satisfy } from "next/font/google";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function GuestBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FEFCF7] via-[#FDF6E8] to-[#FAF0DC] border-b border-[#E8D9BF]">
      {/* Subtle diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #8B6B45 0px, #8B6B45 1px,
            transparent 1px, transparent 14px
          )`,
        }}
      />

      {/* Decorative rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full opacity-[0.07] border border-[#C9A96E]" />
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.07] border border-[#C9A96E]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.03] border border-[#8B6B45]" />
      </div>

      {/* Soft bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF0DC]/60 to-transparent" />

      {/* Two-column layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* LEFT: Text */}
          <div className="flex-1 text-center lg:text-left">

            {/* Pre-label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="w-14 h-px bg-gradient-to-r from-transparent to-[#C9A96E]" />
              <span
                className={`${cinzel.className} text-[#C9A96E] text-[0.6rem] tracking-[0.35em] uppercase`}
              >
                Raja Parba 2025
              </span>
              <div className="w-14 h-px lg:hidden bg-gradient-to-l from-transparent to-[#C9A96E]" />
            </motion.div>

            {/* Title line 1 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`${playfair.className} text-[#2C1E10] font-bold tracking-tight`}
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.15,
              }}
            >
              Our Honoured
            </motion.h1>

            {/* Title line 2 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`${playfair.className} text-[#8B6B45] font-bold italic tracking-tight mb-4`}
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.15,
              }}
            >
              Guests
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`${cormorant.className} max-w-lg mx-auto lg:mx-0 text-[#7A6248] italic leading-relaxed`}
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
              }}
            >
              Distinguished luminaries, sacred custodians, and beloved souls whose
              presence graces our festival with wisdom, beauty, and enduring grace.
            </motion.p>

            {/* Bottom ornamental divider */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 flex items-center justify-center lg:justify-start gap-5"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C9A96E]" />
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[#C9A96E] text-lg"
              >
                ✦
              </motion.span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C9A96E]" />
            </motion.div>
          </div>

          {/* RIGHT: Static Image */}
          <div className="flex-1 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden shadow-2xl"
            >
              {/* Warm glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 via-transparent to-amber-600/20 z-10" />
              
              {/* Decorative frame */}
              <div className="absolute inset-0 border-8 border-white/30 z-20 rounded-lg" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-200/60 z-30" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-200/60 z-30" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-200/60 z-30" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-200/60 z-30" />
              
              {/* Static image - replace with your actual image path */}
              <Image
                src="/images/raja-parba-guest.jpg" // Replace with your actual image path
                alt="Raja Parba Festival Guest"
                fill
                className="object-cover"
                priority
              />
              
              {/* Image caption */}
              <div className="absolute bottom-4 left-4 right-4 text-center z-20">
                <div className="inline-block px-4 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                  <span className={`${satisfy.className} text-white text-sm`}>
                    Raja Parba 2025
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}