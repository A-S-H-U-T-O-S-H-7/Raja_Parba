"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export default function FarmersSection() {
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
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #0a1a0a 0%, #0d1f0d 25%, #122412 50%, #162a16 75%, #0e1a0e 100%)",
      }}
    >
      {/* Atmospheric radial glow — earthy green tones only */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 20%, rgba(40,90,40,0.3) 0%, transparent 60%)," +
            "radial-gradient(ellipse at 20% 80%, rgba(30,80,30,0.2) 0%, transparent 50%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "140px",
        }}
      />

      {/* Rain streaks — green-tinted */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(32)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 3.2) % 100}%`,
              top: 0,
              width: "1px",
              height: "45px",
              background:
                "linear-gradient(to bottom, transparent, rgba(120,200,120,0.15), transparent)",
            }}
            initial={{ y: -60 }}
            animate={{ y: "110vh" }}
            transition={{
              duration: 1.8 + (i % 5) * 0.35,
              repeat: Infinity,
              delay: (i % 9) * 0.25,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative mx-auto max-w-8xl px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

          {/* ── Content Side ── */}
          <div className="flex flex-col gap-5">

            {/* Label */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: "#6abf6a" }} />
              <span
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6abf6a",
                }}
              >
                The Sacred Pause
              </span>
            </motion.div>

            {/* Heading — keeping serif for title as requested */}
            <motion.h2
              {...fadeUp(0.1)}
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#eef2ee",
              }}
            >
              Waiting for the{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(90deg, #6abf6a, #a8d5a2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                First Rain
              </span>
            </motion.h2>

            {/* Paragraphs — normal system font */}
            <motion.p
              {...fadeUp(0.2)}
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#b0c8b0",
              }}
            >
              When Raja ends, farmers don&apos;t rush to their fields. They wait.
              They watch the sky. They feel the wind change.{" "}
              <span style={{ color: "#d4e8b0", fontWeight: 600 }}>
                Only after Basumati Snana, after the Earth has bathed and rested,
                do they pick up their plows.
              </span>
            </motion.p>

            <motion.p
              {...fadeUp(0.28)}
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#90b090",
              }}
            >
              This is not just agriculture. This is conversation. For generations,
              Odisha&apos;s farmers have understood that the land is not a machine
              to be run — it is a mother to be respected.{" "}
              <span style={{ color: "#a8d5a2" }}>
                Give her rest, and she gives you abundance.
              </span>
            </motion.p>

            <motion.p
              {...fadeUp(0.35)}
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#90b090",
              }}
            >
              The first monsoon rain after Raja is not just water. It is blessing.
              It is permission. It is the Earth saying,{" "}
              <em style={{ color: "#c0e0b0" }}>
                "I am ready now. Let us create together."
              </em>
            </motion.p>

            {/* Quote box */}
            <motion.div
              {...fadeUp(0.42)}
              className="rounded-xl p-5"
              style={{
                background: "rgba(10,26,10,0.7)",
                border: "1px solid rgba(106,191,106,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>🌧️</span>
              <p
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1.15rem",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  color: "#c0e0b0",
                  marginTop: "0.5rem",
                }}
              >
                "We don&apos;t sow seeds. We plant gratitude. And gratitude
                grows best in rested soil."
              </p>
              <p
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  color: "#4a8a4a",
                  marginTop: "0.5rem",
                }}
              >
                — Odisha farmer&apos;s wisdom
              </p>
            </motion.div>
          </div>

          {/* ── Image Side ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Glow frame — green only */}
            <div
              className="absolute -inset-3 rounded-2xl opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, #6abf6a, transparent 60%)",
              }}
            />

            <div
              className="relative overflow-hidden rounded-xl"
              style={{
                height: "420px",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(106,191,106,0.12)",
              }}
            >
              <Image
                src="/mansoon.png"
                alt="Monsoon and Farming"
                fill
                className="object-cover"
                style={{
                  filter: "brightness(0.85) saturate(0.95) hue-rotate(-5deg)",
                }}
              />

              {/* Bottom vignette */}
              <div
                className="absolute inset-x-0 bottom-0 h-24"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,26,10,0.9), transparent)",
                }}
              />

              {/* Caption badge */}
              <div
                className="absolute bottom-4 left-4 rounded-lg px-4 py-2"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(106,191,106,0.2)",
                }}
              >
                <p
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#6abf6a",
                  }}
                >
                  After Raja ends
                </p>
                <p
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#eef2ee",
                  }}
                >
                  The Earth speaks. Farmers listen.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}