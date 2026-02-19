"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Cinzel, Cormorant_Garamond, Lora } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const rounds = [
  { day: "13 June", label: "Round 1 — Introduction", desc: "Participants introduce themselves in traditional Odia attire, share their connection to Raja & Odisha.", icon: "🌸" },
  { day: "14 June", label: "Round 2 — Cultural Talent", desc: "Showcase a talent — dance, song, recitation, or art — rooted in Odia culture and tradition.", icon: "🎭" },
  { day: "15 June", label: "Grand Finale & Crowning", desc: "Final round of grace, confidence & cultural Q&A. The Raja Kumari 2026 is crowned on stage.", icon: "👑" },
];

export default function RajaKumariSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 px-4"
      style={{
        background:
          "linear-gradient(155deg, #f5eeff 0%, #ede8f8 35%, #f0e4f5 65%, #f8eef8 100%)",
      }}
    >
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          mixBlendMode: "multiply",
        }}
      />

      {/* Purple radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 85% 20%, rgba(139,58,143,0.1) 0%, transparent 50%)," +
            "radial-gradient(ellipse at 10% 80%, rgba(192,57,43,0.08) 0%, transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left — content */}
          <div className="flex flex-col gap-5">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8" style={{ background: "#8b3a8f" }} />
              <span className={cinzel.className}
                style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8b3a8f" }}>
                Competition
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 }}
              className={cormorant.className}
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.15, color: "#2e1a3a" }}
            >
              Raja{" "}
              <span className="italic"
                style={{ background: "linear-gradient(90deg, #8b3a8f, #c0392b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Kumari
              </span>
              <br />
              <span style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 400, color: "#5a3a6a" }}>
                2026
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: "2px", width: "56px", background: "linear-gradient(90deg, #8b3a8f, transparent)", transformOrigin: "left", borderRadius: "2px" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className={lora.className}
              style={{ fontSize: "1rem", lineHeight: 1.8, color: "#5a3a6a" }}
            >
              Raja Kumari is not a beauty pageant. It is a celebration of{" "}
              <span style={{ fontWeight: 600, color: "#8b3a8f" }}>Odia womanhood</span> —
              her grace, her culture, her roots, and her voice. Girls from across
              Delhi NCR with Odia heritage are invited to participate and represent
              the spirit of Raja.
            </motion.p>

            {/* Rounds */}
            <div className="flex flex-col gap-3 mt-2">
              {rounds.map((round, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.12 }}
                  className="flex gap-4 rounded-xl p-4"
                  style={{
                    background: "rgba(255,252,255,0.8)",
                    border: "1px solid rgba(139,58,143,0.15)",
                    boxShadow: "0 2px 12px rgba(80,30,100,0.06)",
                  }}
                >
                  <div className="flex-shrink-0 text-center" style={{ minWidth: "52px" }}>
                    <div className="rounded-lg px-2 py-1 mb-1"
                      style={{ background: "#8b3a8f" }}>
                      <p className={cinzel.className}
                        style={{ fontSize: "0.52rem", fontWeight: 600, color: "#fff", letterSpacing: "0.05em" }}>
                        {round.day}
                      </p>
                    </div>
                    <span style={{ fontSize: "1.3rem" }}>{round.icon}</span>
                  </div>
                  <div style={{ width: "2px", background: "rgba(139,58,143,0.2)", borderRadius: "2px", flexShrink: 0 }} />
                  <div>
                    <h4 className={cormorant.className}
                      style={{ fontSize: "1.05rem", fontWeight: 700, color: "#2e1a3a", marginBottom: "3px" }}>
                      {round.label}
                    </h4>
                    <p className={lora.className}
                      style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "#7a5a8a" }}>
                      {round.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Register CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-2"
            >
              <button
                className={cinzel.className}
                style={{
                  background: "linear-gradient(135deg, #8b3a8f, #c0392b)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.9rem 2.2rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(139,58,143,0.35)",
                }}
              >
                👑 Register for Raja Kumari
              </button>
            </motion.div>
          </div>

          {/* Right — image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative glow */}
            <div
              className="absolute -inset-4 rounded-2xl opacity-20"
              style={{
                background: "linear-gradient(135deg, #8b3a8f, transparent 60%)",
                filter: "blur(20px)",
              }}
            />

            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                height: "440px",
                boxShadow: "0 20px 60px rgba(80,30,100,0.25), 0 0 0 1px rgba(139,58,143,0.15)",
              }}
            >
              <Image
                src="/images/event-raja-kumari-feature.jpg"
                alt="Raja Kumari 2026"
                fill
                className="object-cover"
                style={{ filter: "brightness(0.9) saturate(1.1)" }}
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(46,26,58,0.75) 0%, transparent 50%)" }} />

              {/* Crown badge */}
              <div
                className="absolute bottom-4 left-4 right-4 text-center rounded-xl py-4 px-4"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(139,58,143,0.3)",
                }}
              >
                <p className={cinzel.className}
                  style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#d4a0d4", textTransform: "uppercase", marginBottom: "6px" }}>
                  Open Registrations
                </p>
                <p className={cormorant.className}
                  style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f5e8f5", fontStyle: "italic" }}>
                  "The Crown awaits the one who carries Odisha in her heart."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}