"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const memories = [
  {
    text: "The smell of rain on dry earth, the first time after months of waiting.",
    icon: "🌧️",
    size: "large",
    rotate: -2,
    opacity: 1,
    align: "left",
    accent: "#8b3a8f",
  },
  {
    text: "Grandmother's hands, shaping pithas before sunrise — flour dust like blessings on her fingers.",
    icon: "👵",
    size: "medium",
    rotate: 1.5,
    opacity: 0.92,
    align: "right",
    accent: "#c0392b",
  },
  {
    text: "The creak of ropes on mango branches. Swinging higher. Touching the sky.",
    icon: "🌿",
    size: "small",
    rotate: -1,
    opacity: 0.82,
    align: "left",
    accent: "#6b4fa0",
  },
  {
    text: "Alta drying on feet, mehndi blooming on palms — red promises of beauty and pride.",
    icon: "🌸",
    size: "large",
    rotate: 2,
    opacity: 1,
    align: "right",
    accent: "#c0392b",
  },
  {
    text: "Laughter that didn't end. Games that stretched into night. Childhood, remembered.",
    icon: "🎲",
    size: "medium",
    rotate: -1.5,
    opacity: 0.88,
    align: "left",
    accent: "#8b3a8f",
  },
  {
    text: "The quiet after the storm — farmers looking at clouds, knowing it's time.",
    icon: "🌾",
    size: "small",
    rotate: 1,
    opacity: 0.75,
    align: "right",
    accent: "#6b4fa0",
  },
];

const sizeStyles = {
  large: { fontSize: "1.2rem", lineHeight: 1.75, maxWidth: "360px" },
  medium: { fontSize: "1rem", lineHeight: 1.75, maxWidth: "300px" },
  small: { fontSize: "0.9rem", lineHeight: 1.75, maxWidth: "260px" },
};

const clipPaths = [
  "polygon(0 0, 100% 2%, 98% 100%, 2% 98%)",
  "polygon(2% 0, 100% 0, 100% 100%, 0 98%)",
  "polygon(0 2%, 98% 0, 100% 98%, 0 100%)",
];

function MemoryFragment({ memory, idx, isInView }) {
  const isRight = memory.align === "right";
  const styles = sizeStyles[memory.size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: memory.rotate * 2 }}
      animate={
        isInView
          ? { opacity: memory.opacity, y: 0, rotate: memory.rotate }
          : { opacity: 0, y: 30, rotate: memory.rotate * 2 }
      }
      transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
      style={{
        marginLeft: isRight ? "auto" : undefined,
        marginRight: isRight ? undefined : "auto",
        width: "fit-content",
      }}
    >
      <div
        className="relative px-6 py-5"
        style={{
          background: idx % 2 === 0
            ? "rgba(255,252,255,0.96)"
            : "rgba(250,246,255,0.94)",
          // Strong visible borders
          borderLeft: isRight ? "none" : `3px solid ${memory.accent}`,
          borderRight: isRight ? `3px solid ${memory.accent}` : "none",
          borderTop: "1px solid rgba(139,58,143,0.15)",
          borderBottom: "1px solid rgba(139,58,143,0.10)",
          boxShadow: `3px 5px 22px rgba(80,30,100,0.12), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 1px rgba(255,255,255,0.6)`,
          maxWidth: styles.maxWidth,
          clipPath: clipPaths[idx % 3],
        }}
      >
        <span
          style={{
            fontSize: "1.6rem",
            lineHeight: 1,
            display: "block",
            marginBottom: "0.5rem",
            opacity: 0.9,
          }}
        >
          {memory.icon}
        </span>

        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            color: "#2e1a3a",
            fontStyle: "italic",
          }}
        >
          {memory.text}
        </p>

        {/* Ink stain */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "8px",
            right: isRight ? "auto" : "10px",
            left: isRight ? "10px" : "auto",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: memory.accent,
            opacity: 0.07,
            filter: "blur(5px)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function MemoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-6 px-4"
      style={{
        background:
          "linear-gradient(160deg, #f5eeff 0%, #ede8f8 30%, #f0e8f5 60%, #f8eef8 100%)",
      }}
    >
      {/* ── Grain texture — strong enough to see on desktop ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.09,
          mixBlendMode: "multiply",
        }}
      />

      {/* Soft purple radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 30%, rgba(139,58,143,0.08) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 85% 70%, rgba(107,79,160,0.07) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ background: "#8b3a8f", opacity: 0.5 }} />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8b3a8f",
              }}
            >
              Eternal Memories
            </span>
            <div className="h-px w-12" style={{ background: "#8b3a8f", opacity: 0.5 }} />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#2e1a3a",
            }}
          >
            Raja{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(90deg, #8b3a8f, #c0392b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Lives Forever
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#5a3a6a",
              maxWidth: "32rem",
              margin: "0.75rem auto 0",
            }}
          >
            The festival ends. The swings come down. But Raja never leaves —
            it settles deep, in the quiet corners where memory lives.
          </p>
        </motion.div>

        {/* ── Scroll / Timeline ── */}
        <div className="relative">

          {/* Center thread */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute left-1/2 top-0 -translate-x-1/2 origin-top"
            style={{
              width: "1px",
              height: "100%",
              background:
                "linear-gradient(to bottom, transparent, rgba(139,58,143,0.35) 10%, rgba(139,58,143,0.35) 90%, transparent)",
            }}
          />

          <div className="flex flex-col gap-6 py-2">
            {memories.map((memory, idx) => (
              <div key={idx} className="relative">

                {/* Thread dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: idx * 0.15 + 0.3 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: memory.accent,
                    boxShadow: `0 0 10px ${memory.accent}99, 0 0 0 3px rgba(255,255,255,0.6)`,
                  }}
                />

                {/* Connector dash */}
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    [memory.align === "left" ? "right" : "left"]: "50%",
                    width: "36px",
                    height: "1px",
                    background: `${memory.accent}66`,
                  }}
                />

                <MemoryFragment memory={memory} idx={idx} isInView={isInView} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Closing quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="relative mt-14 text-center"
        >
          <span
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "9rem",
              lineHeight: 1,
              color: "#8b3a8f",
              opacity: 0.07,
            }}
          >
            "
          </span>

          <div
            className="relative mx-auto max-w-2xl rounded-2xl px-8 py-7"
            style={{
              background: "rgba(255,252,255,0.65)",
              border: "1px solid rgba(139,58,143,0.2)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 4px 28px rgba(80,30,100,0.1), inset 0 0 0 1px rgba(255,255,255,0.7)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "#2e1a3a",
              }}
            >
              Raja is not just a festival. It is Odisha&apos;s way of saying:{" "}
              <span style={{ fontWeight: 700, fontStyle: "normal", color: "#8b3a8f" }}>
                Rest, daughter. You are loved. You are earth. You are eternal.
              </span>
            </p>

            <div className="mt-4 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#8b3a8f",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}