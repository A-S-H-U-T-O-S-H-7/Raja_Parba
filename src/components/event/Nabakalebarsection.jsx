"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Cinzel, Cormorant_Garamond, Lora } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export default function NabaKalebarSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.65, delay, ease: "easeOut" },
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 px-4"
      style={{
        background:
          "linear-gradient(145deg, #0e0d18 0%, #1a0818 30%, #0a0e14 60%, #0e0d18 100%)",
      }}
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Golden atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 40%, rgba(232,168,124,0.12) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 10% 70%, rgba(192,57,43,0.15) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Image side */}
          <motion.div
            {...fadeUp(0)}
            className="relative"
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-4 rounded-2xl opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(232,168,124,0.3), transparent 60%)",
                filter: "blur(20px)",
              }}
            />

            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                height: "440px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,168,124,0.15)",
              }}
            >
              <Image
                src="/nabakalebara.png"
                alt="Nabakalebar — The Film"
                fill
                className="object-cover"
                style={{ filter: "brightness(0.88) saturate(1.05)" }}
              />
              {/* Cinematic bars */}
              <div className="absolute inset-x-0 top-0 h-8"
                style={{ background: "rgba(0,0,0,0.6)" }} />
              <div className="absolute inset-x-0 bottom-0 h-8"
                style={{ background: "rgba(0,0,0,0.6)" }} />

              {/* Film badge */}
              <div
                className="absolute bottom-12 left-4 right-4 rounded-lg px-4 py-3"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(232,168,124,0.25)",
                }}
              >
                <p className={cinzel.className}
                  style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#e8a87c", textTransform: "uppercase", marginBottom: "4px" }}>
                  Main Attraction · 14 June 2026
                </p>
                <p className={cormorant.className}
                  style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f5e8f0", fontStyle: "italic" }}>
                  Exclusive preview + star cast on stage
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <div className="flex flex-col gap-5">

            <motion.div {...fadeUp(0.1)} className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: "#e8a87c" }} />
              <span className={cinzel.className}
                style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#e8a87c" }}>
                Special Attraction
              </span>
            </motion.div>

            <motion.h2 {...fadeUp(0.18)} className={cormorant.className}
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, color: "#f5e8f0" }}>
              Naba{" "}
              <span className="italic"
                style={{ background: "linear-gradient(90deg, #e8a87c, #c0392b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Kalebara
              </span>
            </motion.h2>

            <motion.div {...fadeUp(0.24)}
              style={{ height: "2px", width: "56px", background: "linear-gradient(90deg, #e8a87c, transparent)", borderRadius: "2px" }}
            />

            <motion.p {...fadeUp(0.3)} className={lora.className}
              style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(245,232,240,0.78)" }}>
              The most awaited Odia film of 2026 — a cinematic retelling of the sacred{" "}
              <span style={{ color: "#e8a87c", fontWeight: 500 }}>Nabakalebar</span> ritual of Lord Jagannath.
              A story of devotion, transformation, and the eternal bond between god and land.
            </motion.p>

            <motion.p {...fadeUp(0.36)} className={lora.className}
              style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(245,232,240,0.6)" }}>
              On the night of <span style={{ color: "#e8a87c" }}>14th June</span>, the star cast of Nabakalebar
              will join us live on stage at Ram Leela Ground — for an exclusive preview screening,
              interactions, and a celebration of Odia cinema at its finest.
            </motion.p>

            {/* Highlight pills */}
            <motion.div {...fadeUp(0.44)} className="flex flex-wrap gap-3 mt-2">
              {[
                { icon: "🎬", text: "Exclusive Preview" },
                { icon: "🌟", text: "Star Cast Live" },
                { icon: "📸", text: "Meet & Greet" },
                { icon: "🏛️", text: "Odia Cinema Night" },
              ].map((pill, i) => (
                <div key={i}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5"
                  style={{
                    background: "rgba(232,168,124,0.08)",
                    border: "1px solid rgba(232,168,124,0.2)",
                  }}
                >
                  <span style={{ fontSize: "0.85rem" }}>{pill.icon}</span>
                  <span className={cinzel.className}
                    style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", color: "#e8a87c" }}>
                    {pill.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.blockquote {...fadeUp(0.52)}
              className="rounded-xl p-5 mt-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderLeft: "3px solid #e8a87c",
                paddingLeft: "1.2rem",
              }}
            >
              <p className={cormorant.className}
                style={{ fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1.7, color: "#d4c0b0" }}>
                "When the chariot moves, the whole world moves with it —
                and Nabakalebar captures that moment for eternity."
              </p>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}