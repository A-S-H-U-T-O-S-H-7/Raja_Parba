"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Cinzel, Cormorant_Garamond, Lora } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const attractions = [
  {
    title: "Raja Doli",
    subtitle: "The Sacred Swing",
    desc: "Experience the iconic swing of Raja — fly high, take selfies, and feel the joy Odia girls have celebrated for centuries.",
    image: "/eventdoli.jpg",
    icon: "🌿",
    tag: "Experience",
    accent: "#2d6a4f",
    tagBg: "#eef7f2",
  },
  {
    title: "Odia Stall Bazaar",
    subtitle: "Food · Clothes · Crafts",
    desc: "50+ authentic stalls from Odisha — Poda Pitha, Chenna Poda, Sambalpuri sarees, silver filigree, and more.",
    image: "/rajastall.png",
    icon: "🏪",
    tag: "Shopping & Food",
    accent: "#b5451b",
    tagBg: "#fef4ee",
  },
  {
    title: "Nabakalebar",
    subtitle: "The Film · The Stars",
    desc: "The most anticipated Odia film of 2026. Star cast joins live on stage for an exclusive preview.",
    image: "/nabakalebara.jpg",
    icon: "🎬",
    tag: "Main Attraction",
    accent: "#c0392b",
    tagBg: "#fdf2f0",
    featured: true,
  },
  {
    title: "Raja Kumari",
    subtitle: "The Crown Awaits",
    desc: "A competition celebrating Odia girls — their grace, talent, and cultural pride. One queen crowned on the final night.",
    image: "/rajakumari.jpg",
    icon: "👑",
    tag: "Competition",
    accent: "#8b3a8f",
    tagBg: "#f8eef8",
    featured: true,
  },
  {
    title: "Live Performers",
    subtitle: "Singers · Dancers · Comedians",
    desc: "Top Odia artists take the stage every night — folk singers, Odissi dancers, and stand-up comedians.",
    image: "/crowd.png",
    icon: "🎵",
    tag: "Entertainment",
    accent: "#1a6b8a",
    tagBg: "#edf6fa",
  },
  {
    title: "Fancy Dress",
    subtitle: "Dress as Odisha",
    desc: "Come dressed as your favourite Odia deity, folk character, or festival tradition. Exciting prizes await.",
    image: "/mandala.png",
    icon: "🎭",
    tag: "Competition",
    accent: "#9a6b1a",
    tagBg: "#fdf0e0",
  },
];

function AttractionCard({ item, idx, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: idx * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-[rgba(255,252,248,0.92)]"
      style={{
        border: `1px solid ${item.accent}18`,
        boxShadow: "0 3px 18px rgba(44,24,16,0.07)",
        ...(item.featured ? { gridColumn: "span 1" } : {}),
      }}
    >
      {/* Featured badge */}
      {item.featured && (
        <div
          className="absolute top-3 right-3 z-20 rounded-full px-2.5 py-1"
          style={{ background: item.accent, boxShadow: `0 2px 8px ${item.accent}66` }}
        >
          <span className={`${cinzel.className} text-[0.55rem] font-bold tracking-[0.15em] text-white uppercase`}>
            ★ Featured
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden h-[200px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
        />
        {/* Top accent bar */}
        <div className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fffcfa] to-transparent" />

        {/* Tag */}
        <div
          className="absolute bottom-3 left-3 rounded-full px-3 py-1 flex items-center gap-1.5"
          style={{ background: item.tagBg, border: `1px solid ${item.accent}30` }}
        >
          <span className="text-[0.8rem]">{item.icon}</span>
          <span className={`${cinzel.className} text-[0.58rem] font-semibold tracking-[0.12em] uppercase`}
            style={{ color: item.accent }}>
            {item.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-3">
        <h3 className={`${cormorant.className} text-[1.25rem] font-bold text-[#2c1810] mb-0.5`}>
          {item.title}
        </h3>
        <p className={`${cinzel.className} text-[0.62rem] font-semibold tracking-[0.15em] uppercase mb-1`}
          style={{ color: item.accent }}>
          {item.subtitle}
        </p>
        <div className="h-px w-8 mb-2" style={{ background: item.accent, opacity: 0.3 }} />
        <p className={`${lora.className} text-[0.875rem] leading-[1.7] text-[#6b4c38]`}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function EventAttractionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-8 px-4"
      style={{
        background:
          "linear-gradient(150deg, #f5e8d0 0%, #eedad8 35%, #f0e2cc 65%, #ecddd0 100%)",
      }}
    >
      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "120px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#b5451b] opacity-50" />
            <span className={`${cinzel.className} text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-[#b5451b]`}>
              What's Happening
            </span>
            <div className="h-px w-10 bg-[#b5451b] opacity-50" />
          </div>
          <h2 className={`${cormorant.className} text-[clamp(2rem,4vw,2.75rem)] font-bold text-[#2c1810]`}>
            Six Reasons to{" "}
            <span className="italic bg-gradient-to-r from-[#b5451b] to-[#8b3a8f] bg-clip-text text-transparent">
              Be There
            </span>
          </h2>
          <p className={`${lora.className} text-[1rem] leading-[1.75] text-[#7a5040] max-w-[34rem] mx-auto mt-2`}>
            From the sacred swing to the silver screen — Raja Mahotsav 2026 has something for every soul.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.map((item, idx) => (
            <AttractionCard key={idx} item={item} idx={idx} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}