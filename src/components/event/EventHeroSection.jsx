"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Cinzel, Cormorant_Garamond } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const countdownDays = () => {
  const event = new Date("2026-06-13");
  const now = new Date();
  const diff = Math.ceil((event - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export default function EventHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex items-center "
      style={{
        background: "linear-gradient(145deg, #1a0818 0%, #2d0f1e 30%, #1f0a14 55%, #0e0d18 100%)",
      }}
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Atmospheric glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 60%, rgba(192,57,43,0.2) 0%, transparent 50%)," +
            "radial-gradient(ellipse at 85% 30%, rgba(139,58,143,0.18) 0%, transparent 50%)," +
            "radial-gradient(ellipse at 50% 100%, rgba(232,168,124,0.1) 0%, transparent 40%)",
        }}
      />

      {/* Mandala BG */}
      <div
        className="pointer-events-none absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-[0.07] w-[600px] h-[500px]"
      >
        <Image 
          src="/mandala3.png" 
          alt="" 
          fill 
          className="object-contain animate-[spin_90s_linear_infinite_reverse]" 
        />
      </div>
      <div
        className="pointer-events-none absolute left-[-60px] bottom-0 opacity-[0.05] w-[300px] h-[300px]"
      >
        <Image 
          src="/mandala2.png" 
          alt="" 
          fill 
          className="object-contain animate-[spin_70s_linear_infinite]" 
        />
      </div>

      {/* Hero image — background cinematic */}
      <div className="absolute inset-0">
        <Image
          src="/crowd.png"
          alt="Raja Mahotsav"
          fill
          className="object-cover object-center opacity-18"
          style={{ mixBlendMode: "luminosity" }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(26,8,24,0.95) 0%, rgba(26,8,24,0.6) 50%, rgba(26,8,24,0.2) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-8xl px-6 lg:px-10 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-3"
            >
              <div className="h-px w-8 bg-[#e8a87c]" />
              <span
                className={`${cinzel.className} text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-[#e8a87c]`}
              >
                Odisha Cultural Fest · NCR 2026
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`${cinzel.className} text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.05] text-[#f5e8f0] mb-2`}
            >
              Raja
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className={`${cormorant.className} text-[clamp(1.6rem,3.5vw,2.8rem)] font-semibold italic leading-[1.2] mb-5 bg-gradient-to-r from-[#e8a87c] via-[#c0392b] to-[#8b3a8f] bg-clip-text text-transparent`}
            >
              Mahotsav 2026
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="h-[2px] w-20 bg-gradient-to-r from-[#e8a87c] to-transparent mb-5 origin-left"
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`${cormorant.className} text-[1.15rem] leading-[1.75] text-[rgba(245,232,240,0.75)] max-w-[30rem] mb-8`}
            >
              Three days of Odisha's most sacred festival — food, music, dance,
              swings, and stories — brought to the heart of Delhi NCR.
            </motion.p>

            {/* Date / Venue pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {[
                { icon: "📅", label: "13 – 15 June 2026" },
                { icon: "📍", label: "Ram Leela Ground, Noida" },
                { icon: "🕕", label: "5:00 PM Onwards" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/6 border border-[rgba(232,168,124,0.2)] backdrop-blur-[8px]"
                >
                  <span className="text-[0.9rem]">{item.icon}</span>
                  <span
                    className={`${cinzel.className} text-[0.7rem] font-medium tracking-[0.1em] text-[#f0dde8]`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — countdown + highlight image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Event poster / image */}
            <div
              className="relative overflow-hidden rounded-xl h-[320px] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(232,168,124,0.12)]"
            >
              <Image
                src="/stage.png"
                alt="Raja Mahotsav 2026"
                fill
                className="object-cover brightness-90 saturate-110"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,8,24,0.8) 0%, transparent 50%)",
                }}
              />
              {/* Days badge */}
              <div
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg px-4 py-3 bg-black/50 backdrop-blur-[12px] border border-[rgba(232,168,124,0.2)]"
              >
                <div>
                  <p className={`${cinzel.className} text-[0.6rem] tracking-[0.15em] text-[#e8a87c] uppercase`}>
                    Countdown
                  </p>
                  <p className={`${cinzel.className} text-[1.4rem] font-bold text-[#f5e8f0]`}>
                    {countdownDays()} Days to Go
                  </p>
                </div>
                <div className="text-3xl">🎪</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "3", label: "Epic Days" },
                { val: "10+", label: "Artists" },
                { val: "50+", label: "Stalls" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl py-4 text-center bg-white/4 border border-[rgba(139,58,143,0.2)]"
                >
                  <p className={`${cinzel.className} text-[1.6rem] font-bold text-[#e8a87c]`}>
                    {stat.val}
                  </p>
                  <p className={`${cormorant.className} text-[0.8rem] text-[rgba(245,232,240,0.55)] mt-0.5`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#1a0818]"
      />
    </section>
  );
}