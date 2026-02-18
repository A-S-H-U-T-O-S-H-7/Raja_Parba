"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Cinzel, Cormorant_Garamond } from "next/font/google";

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

const elements = [
  {
    id: 1,
    title: "Poda Pitha",
    description:
      "The smoky-sweet aroma that wakes up with the sun. Baked overnight in earth ovens, every bite carries generations of love.",
    image: "/podapitha2.png",
    icon: "🔥",
    accent: "#e8a87c",
  },
  {
    id: 2,
    title: "Manda Pitha",
    description:
      "Soft rice dumplings cradling sweet coconut and jaggery. Steamed to perfection, they melt like memories on your tongue.",
    image: "/mandapitha.png",
    icon: "🥟",
    accent: "#a8d5a2",
  },
  {
    id: 3,
    title: "Raja Doli",
    description:
      "Swings tied to ancient mango branches. Girls fly high, touching the sky, their laughter becoming the music of monsoon.",
    image: "/rajadoli2.png",
    icon: "🌿",
    accent: "#a8d5a2",
  },
  {
    id: 4,
    title: "Chenna Poda",
    description:
      "The cheesecake of Odisha — caramelized, burnt, beautiful. A dessert that tastes like celebration itself.",
    image: "/chenapoda.png",
    icon: "🍰",
    accent: "#e8a87c",
  },
  {
    id: 5,
    title: "Alta & Mehndi",
    description:
      "Red alta tracing poetry on feet. Mehndi blooming like monsoon flowers on open palms. Every girl becomes a goddess.",
    image: "/alata.png",
    icon: "🌸",
    accent: "#f4a0a0",
  },
  {
    id: 6,
    title: "New Dresses",
    description:
      "The rustle of new cotton. Bright colors mirroring the rain-washed earth. Raja's first gift to every daughter.",
    image: "/nuadress.png",
    icon: "👗",
    accent: "#e8b4e8",
  },
  {
    id: 7,
    title: "Ludo & Games",
    description:
      "Courtyards filled with dice and laughter. Three days where work pauses and play begins. Childhood, relived.",
    image: "/mandir3.png",
    icon: "🎲",
    accent: "#e8a87c",
  },
  {
    id: 8,
    title: "Mitha Pana",
    description:
      "Cool palm-sugar drinks on warm monsoon afternoons. Every sip is a pause — sweet, slow, sacred.",
    image: "/mithapana.png",
    icon: "🥤",
    accent: "#a8d5a2",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((p) => (p + 1) % elements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const active = elements[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "clamp(420px, 52vw, 520px)",
        background:
          "linear-gradient(135deg, #1a0818 0%, #2d0f1e 35%, #220a18 65%, #1a0810 100%)",
      }}
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Static deep crimson-plum radial atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(160,30,80,0.25) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 80% 50%, rgba(100,15,50,0.2) 0%, transparent 55%)",
        }}
      />

      {/* Dynamic per-slide accent glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${activeIndex}`}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${active.accent}18 0%, transparent 60%)`,
          }}
        />
      </AnimatePresence>

      {/* Mandala RIGHT — behind image, purely decorative */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
        style={{ width: "420px", height: "420px", opacity: 0.1 }}
      >
        <Image
          src="/mandala3.png"
          alt=""
          fill
          className="object-contain"
          style={{ animation: "spin 60s linear infinite reverse" }}
        />
      </div>

      {/* Mandala LEFT — barely visible edge accent */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: "180px",
          height: "180px",
          opacity: 0.06,
          marginLeft: "-60px",
        }}
      >
        <Image
          src="/mandala2.png"
          alt=""
          fill
          className="object-contain"
          style={{ animation: "spin 80s linear infinite" }}
        />
      </div>

      {/* ── Main layout ── */}
      <div className="relative h-full mx-auto max-w-6xl px-6 lg:px-10 flex items-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center w-full">

          {/* ── Left: Text ── */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${activeIndex}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Label */}
                <div className="mb-3 flex items-center gap-3">
                  <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>
                    {active.icon}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-px w-6"
                      style={{ background: active.accent, opacity: 0.8 }}
                    />
                    <span
                      className={cinzel.className}
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: active.accent,
                      }}
                    >
                      The Soul of Raja
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1
                  className={playfair.className}
                  style={{
                    fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: "#f5e8f0",
                    marginBottom: "0.75rem",
                  }}
                >
                  {active.title}
                </h1>

                {/* Accent line */}
                <div
                  style={{
                    height: "2px",
                    width: "48px",
                    background: `linear-gradient(90deg, ${active.accent}, transparent)`,
                    marginBottom: "0.9rem",
                    borderRadius: "2px",
                  }}
                />

                {/* Description */}
                <p
                  className={cormorant.className}
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.75,
                    color: "rgba(245,232,240,0.75)",
                    maxWidth: "28rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {active.description}
                </p>

                {/* Progress dots */}
                <div className="flex gap-2 items-center">
                  {elements.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      style={{
                        height: "3px",
                        width: idx === activeIndex ? "2rem" : "0.6rem",
                        borderRadius: "2px",
                        background:
                          idx === activeIndex
                            ? active.accent
                            : "rgba(245,232,240,0.2)",
                        transition: "all 0.3s ease",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right: Image ── */}
          <div
            className="order-1 lg:order-2 relative flex items-center justify-center"
            style={{ height: "clamp(200px, 32vw, 360px)" }}
          >
            {/* Glow halo */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`halo-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(ellipse at center, ${active.accent}35 0%, ${active.accent}12 40%, transparent 70%)`,
                  filter: "blur(18px)",
                  transform: "scale(0.85)",
                }}
              />
            </AnimatePresence>

            {/* Decorative ring */}
            <div
              className="absolute inset-4 rounded-full pointer-events-none"
              style={{
                border: `1px solid ${active.accent}22`,
              }}
            />

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    filter: "drop-shadow(0 8px 40px rgba(160,30,80,0.4))",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(20,4,12,0.5))",
        }}
      />
    </section>
  );
}