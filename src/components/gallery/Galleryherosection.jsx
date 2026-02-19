"use client";

import { motion } from "framer-motion";
import { Cinzel, Cormorant_Garamond, Satisfy } from "next/font/google";
import Image from "next/image";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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

export default function GalleryHeroSection() {
  const frames = [
    {
      src: "/path-to-image-1.jpg",
      rotate: "-rotate-6",
      x: "-translate-x-24",
      y: "-translate-y-6",
      z: "z-10",
      caption: "Monsoon '94",
      filter: "sepia",
    },
    {
      src: "/path-to-image-2.jpg",
      rotate: "rotate-3",
      x: "translate-x-12",
      y: "translate-y-4",
      z: "z-20",
      caption: "Raja's smile",
      filter: "grayscale",
    },
    {
      src: "/path-to-image-3.jpg",
      rotate: "-rotate-2",
      x: "-translate-x-8",
      y: "-translate-y-12",
      z: "z-30",
      caption: "Evening chai",
      filter: "sepia brightness-90",
    },
    {
      src: "/path-to-image-4.jpg",
      rotate: "rotate-8",
      x: "translate-x-20",
      y: "-translate-y-2",
      z: "z-40",
      caption: "First rain",
      filter: "contrast-125 saturate-50",
    },
  ];

  return (
    <section className="relative overflow-hidden py-10 px-4 text-center min-h-[430px] flex items-center">
      {/* Deep Monsoon Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0b14] via-[#1a0f1d] to-[#140b18]" />

      {/* Vintage Paper Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Vermilion Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(140,35,58,0.18),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(186,75,58,0.15),transparent_45%)]" />

      {/* Subtle Grain Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%270 0 512 512%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column - Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Top Label */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/60" />
              <span
                className={`${cinzel.className} text-xs tracking-[0.35em] uppercase text-amber-400`}
              >
                Moments & Memories
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/60 lg:hidden" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`${cinzel.className} text-5xl md:text-6xl lg:text-7xl font-bold text-amber-300 leading-tight mb-6`}
            >
              The Gallery
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className={`${cormorant.className} text-xl md:text-2xl text-amber-200/70 max-w-2xl mx-auto lg:mx-0 italic`}
            >
              Every photograph preserves a fragment of Raja —  
              the monsoon breeze, the laughter, the sacred glow.
            </motion.p>

            {/* Elegant Divider */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-12 flex items-center justify-center lg:justify-start gap-5"
            >
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400/70" />
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-amber-400 text-xl"
              >
                ✦
              </motion.span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400/70" />
            </motion.div>
          </div>

          {/* Right — Vintage Polaroid frames, desktop */}
          <div className="flex-1 relative hidden lg:flex items-center justify-center h-96">
            {/* Background Polaroid Shadows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(186,75,58,0.1),transparent_70%)]" />
            
            {frames.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: parseInt(f.rotate) || 0 }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 0,
                  zIndex: 50,
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.15 + i * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
                className={`absolute ${f.x} ${f.y} ${f.z} cursor-pointer group`}
              >
                {/* Vintage Polaroid Frame */}
                <div className="relative">
                  {/* Main Polaroid Card */}
                  <div className="bg-[#f4efe6] p-2 pb-8 shadow-2xl w-40 
                                border border-amber-200/30 hover:border-amber-400/50
                                transition-all duration-500">
                    
                    {/* Image Container with Vintage Filters */}
                    <div className={`relative w-full h-28 overflow-hidden ${f.filter}`}>
                      {/* Replace with your actual Image component */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-800/20 to-amber-600/20" />
                      
                      {/* Vintage Light Leak Animation */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-amber-400/0 via-amber-400/0 to-amber-400/30"
                        animate={{
                          opacity: [0, 0.4, 0],
                        }}
                        transition={{
                          duration: 5,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Simulated Photo Corners */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400/40" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400/40" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400/40" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400/40" />
                    </div>
                    
                    {/* Bottom Strip with Vintage Caption */}
                    <div className="flex flex-col items-center justify-center h-8 mt-1">
                      <div className="w-14 h-px bg-amber-300/50 mb-1" />
                      <motion.span 
                        className={`${satisfy.className} text-xs text-amber-700/80`}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {f.caption}
                      </motion.span>
                    </div>
                  </div>

                  {/* Vintage Shadow */}
                  <div className="absolute -inset-1 -z-10 bg-amber-900/30 blur-lg 
                                group-hover:bg-amber-700/40 transition-colors duration-500" />
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 
                                bg-amber-500/10 blur-xl transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}

            {/* Floating Dust Particles Animation */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute w-1 h-1 bg-amber-200/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  delay: i * 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Soft Bottom Fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f0b14] to-transparent" />
    </section>
  );
}