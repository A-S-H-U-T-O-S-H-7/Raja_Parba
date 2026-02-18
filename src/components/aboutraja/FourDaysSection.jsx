"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const days = [
  {
    name: "Pahili Raja",
    meaning: "The First Day",
    description:
      "Homes awaken to the aroma of new clothes and turmeric. Girls rise before the sun, bathe, and adorn themselves. The world pauses to watch them shine.",
    accent: "#c0392b",
    lightBg: "#fdf2f0",
    borderColor: "rgba(192,57,43,0.18)",
    icon: "🌅",
    num: "01",
  },
  {
    name: "Mithuna Sankranti",
    meaning: "The Main Day",
    description:
      "The Earth bleeds and rests. Swings are tied to ancient banyan trees. Laughter fills the air. No one walks on soil — it is given complete rest.",
    accent: "#2d6a4f",
    lightBg: "#eef7f2",
    borderColor: "rgba(45,106,79,0.18)",
    icon: "🌿",
    num: "02",
  },
  {
    name: "Basi Raja",
    meaning: "The Day After",
    description:
      "Leftover feasts taste sweeter. Games stretch into the night. Girls glow in their finest, knowing they are seen, celebrated, and loved.",
    accent: "#b5451b",
    lightBg: "#fef4ee",
    borderColor: "rgba(181,69,27,0.18)",
    icon: "🎲",
    num: "03",
  },
  {
    name: "Basumati Snana",
    meaning: "Earth's Bath",
    description:
      "The Earth is bathed with ritual water. Farmers whisper gratitude. The soil is now ready — for sowing, for rain, for new life.",
    accent: "#1a6b8a",
    lightBg: "#edf6fa",
    borderColor: "rgba(26,107,138,0.18)",
    icon: "💧",
    num: "04",
  },
];

export default function FourDaysSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-8 px-4"
      style={{
        background:
          "linear-gradient(160deg, #fefaf5 0%, #fdf4ec 30%, #faf0e8 60%, #fdf7f0 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px, #7a3a1e 1.5px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top fade from dark section */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-10"
        style={{
          background: "linear-gradient(to bottom, rgba(26,8,0,0.05), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#c0392b] opacity-40" />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#c0392b",
              }}
            >
              Four Days of Celebration
            </span>
            <div className="h-px w-10 bg-[#c0392b] opacity-40" />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#2c1810",
            }}
          >
            Each Dawn,{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(90deg, #c0392b, #e8a87c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              A New Story
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#7a5c44",
              maxWidth: "36rem",
              margin: "0.75rem auto 0",
            }}
          >
            Raja doesn&apos;t arrive in a day. It unfolds like a monsoon flower
            blooming petal by petal — each dawn carrying its own sacred ritual.
          </p>
        </motion.div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {days.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="group relative flex flex-col rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: day.lightBg,
                border: `1px solid ${day.borderColor}`,
                boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
                style={{
                  background: `linear-gradient(90deg, ${day.accent}, transparent)`,
                }}
              />

              {/* Icon + ghost number */}
              <div className="mb-3 flex items-start justify-between">
                <span style={{ fontSize: "2rem", lineHeight: 1 }}>{day.icon}</span>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    opacity: 0.08,
                    color: day.accent,
                  }}
                >
                  {day.num}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "#2c1810",
                  marginBottom: "0.2rem",
                }}
              >
                {day.name}
              </h3>

              {/* Meaning */}
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: day.accent,
                  marginBottom: "0.75rem",
                }}
              >
                {day.meaning}
              </span>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  width: "2rem",
                  background: day.accent,
                  opacity: 0.25,
                  marginBottom: "0.75rem",
                }}
              />

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "#6b4f3a",
                }}
              >
                {day.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 text-center"
        >
          <div
            className="inline-block rounded-full px-6 py-2.5"
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(192,57,43,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.9rem",
                color: "#7a5c44",
              }}
            >
              <span style={{ fontWeight: 600, color: "#c0392b" }}>
                Three days of rest, one day of gratitude —{" "}
              </span>
              A rhythm as old as the Earth itself.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}