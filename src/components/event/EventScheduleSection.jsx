"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Cinzel, Cormorant_Garamond, Lora } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const days = [
  {
    date: "13 June",
    day: "Saturday",
    label: "Pahili Raja",
    theme: "Opening Day",
    accent: "#c0392b",
    bg: "#fdf2f0",
    events: [
      { time: "10:00 AM", title: "Odia Stall Bazaar Opens", desc: "50+ stalls — food, clothes, handicrafts from Odisha", icon: "🏪" },
      { time: "10:30 AM", title: "Raja Doli — The Sacred Swing", desc: "Traditional swing experience & photo zone opens", icon: "🌿" },
      { time: "5:00 PM", title: "Grand Inauguration Ceremony", desc: "Official lamp lighting & welcome ceremony by dignitaries", icon: "🪔" },
      { time: "6:00 PM", title: "Live Cultural Performances", desc: "Odissi & folk dance by renowned troupes", icon: "💃" },
      { time: "7:00 PM", title: "Melodious Evening - Live Songs", desc: "Soulful Odia songs by popular singers", icon: "🎤" },
    ],
  },
  {
    date: "14 June",
    day: "Sunday",
    label: "Mithuna Sankranti",
    theme: "The Main Day",
    accent: "#8b3a8f",
    bg: "#f8eef8",
    events: [
      { time: "10:00 AM", title: "Odia Stall Bazaar Opens", desc: "Explore authentic Odia handicrafts, textiles & food", icon: "🏪" },
      { time: "10:30 AM", title: "Raja Doli — The Sacred Swing", desc: "Traditional swing experience continues", icon: "🌿" },
      { time: "5:00 PM", title: "Lamp Lighting Ceremony", desc: "Traditional inauguration of evening events", icon: "🪔" },
      { time: "5:30 PM", title: "Speeches from Odia Delegates", desc: "Leaders & cultural ambassadors from Odisha address the gathering", icon: "🎙️" },
      { time: "6:00 PM", title: "Live Music — Odia Folk & Film", desc: "Popular Odia singers perform live on stage", icon: "🎵" },
      { time: "8:00 PM", title: "Nabakalebar Special Screening", desc: "Exclusive preview of the upcoming Jagannath film", icon: "🎬" },
      { time: "9:00 PM", title: "Award Ceremony", desc: "Honoring cultural contributors & competition winners", icon: "🏆" },
    ],
  },
  {
    date: "15 June",
    day: "Monday",
    label: "Basi Raja",
    theme: "Grand Finale",
    accent: "#2d6a4f",
    bg: "#eef7f2",
    events: [
      { time: "10:00 AM", title: "Odia Stall Bazaar Opens", desc: "Last day to shop from Odisha's finest", icon: "🏪" },
      { time: "10:30 AM", title: "Raja Doli — The Sacred Swing", desc: "Final day for the traditional swing experience", icon: "🌿" },
      { time: "5:00 PM", title: "Lamp Lighting Ceremony", desc: "Traditional start to the finale evening", icon: "🪔" },
      { time: "6:00 PM", title: "Prize Distribution Ceremony", desc: "Winners announced for Raja Kumari, Raja Queen, Drawing Competition & more", icon: "🏆" },
      { time: "7:00 PM", title: "Melody Night - Songs & Dance", desc: "Grand musical evening with dance performances", icon: "🎶" },
      { time: "9:30 PM", title: "Grand Closing Ceremony", desc: "Traditional farewell with aarti and heartfelt wishes for next Raja", icon: "🪔" },
      { time: "10:00 PM", title: "Wishing Everyone - Happy Raja", desc: "A long wait begins for next year's celebration", icon: "🌸" },
    ],
  },
];

export default function EventScheduleSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeDay, setActiveDay] = useState(0);

  const day = days[activeDay];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-6 px-4"
      style={{
        background:
          "linear-gradient(160deg, #fefaf5 0%, #fdf4ec 40%, #faf0e6 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle at 1.5px 1.5px, #7a3a1e 1.5px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#c0392b] opacity-40" />
            <span className={`${cinzel.className} text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-[#c0392b]`}>
              Event Schedule
            </span>
            <div className="h-px w-10 bg-[#c0392b] opacity-40" />
          </div>
          <h2 className={`${cormorant.className} text-[clamp(2rem,4vw,2.75rem)] font-bold text-[#2c1810]`}>
            Three Days of{" "}
            <span className="italic bg-gradient-to-r from-[#c0392b] to-[#8b3a8f] bg-clip-text text-transparent">
              Celebration
            </span>
          </h2>
          <p className={`${lora.className} text-[1rem] leading-[1.75] text-[#7a5040] max-w-[32rem] mx-auto mt-2`}>
            Join us from morning to evening as Ram Leela Ground transforms into Odisha for three unforgettable days.
          </p>
        </motion.div>

        {/* Day tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex gap-3 justify-center mb-8 flex-wrap"
        >
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`${cinzel.className} px-6 py-2.5 rounded-[6px] text-[0.72rem] font-semibold tracking-[0.12em] uppercase cursor-pointer transition-all duration-250`}
              style={{
                background: activeDay === i ? d.accent : "rgba(255,255,255,0.7)",
                color: activeDay === i ? "#fff" : d.accent,
                border: `1.5px solid ${d.accent}`,
                boxShadow: activeDay === i ? `0 4px 16px ${d.accent}44` : "none",
              }}
            >
              <span className="block text-[0.65rem] opacity-80">{d.date}</span>
              {d.label}
            </button>
          ))}
        </motion.div>

        {/* Day header card */}
        <motion.div
          key={`header-${activeDay}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl px-6 py-5 mb-6 flex items-center justify-between"
          style={{
            background: day.bg,
            border: `1.5px solid ${day.accent}30`,
            boxShadow: `0 4px 20px ${day.accent}15`,
          }}
        >
          <div>
            <p className={`${cinzel.className} text-[0.65rem] tracking-[0.2em] uppercase mb-1`}
              style={{ color: day.accent }}>
              {day.day} · {day.date} June 2026
            </p>
            <h3 className={`${cormorant.className} text-[1.8rem] font-bold text-[#2c1810]`}>
              {day.theme}
            </h3>
          </div>
          <div className="text-4xl">
            {activeDay === 0 ? "🌅" : activeDay === 1 ? "🌸" : "🏆"}
          </div>
        </motion.div>

        {/* Morning Events Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-6 w-1 rounded-full bg-amber-500"></div>
            <h4 className={`${cinzel.className} text-sm tracking-wider uppercase text-amber-700`}>Morning Schedule</h4>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {day.events
              .filter(e => e.time.includes("AM"))
              .map((event, i) => (
                <motion.div
                  key={`${activeDay}-morning-${i}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex gap-4 rounded-xl p-4 bg-[rgba(255,252,248,0.9)] border-l-4"
                  style={{
                    borderLeftColor: day.accent,
                    border: `1px solid ${day.accent}18`,
                    boxShadow: "0 2px 10px rgba(44,24,16,0.05)",
                  }}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 text-center min-w-[70px]">
                    <div
                      className="rounded-lg px-2 py-1 mb-1"
                      style={{ background: day.accent }}
                    >
                      <p className={`${cinzel.className} text-[0.6rem] font-semibold text-white tracking-[0.05em]`}>
                        {event.time}
                      </p>
                    </div>
                    <span className="text-2xl">{event.icon}</span>
                  </div>

                  {/* Divider */}
                  <div className="w-[2px] flex-shrink-0 rounded-[2px]" style={{ background: `${day.accent}25` }} />

                  {/* Content */}
                  <div>
                    <h4 className={`${cormorant.className} text-[1.1rem] font-bold text-[#2c1810] mb-1`}>
                      {event.title}
                    </h4>
                    <p className={`${lora.className} text-[0.82rem] leading-[1.6] text-[#7a5040]`}>
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Evening Events Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3 mt-6">
            <div className="h-6 w-1 rounded-full bg-indigo-500"></div>
            <h4 className={`${cinzel.className} text-sm tracking-wider uppercase text-indigo-700`}>Evening Schedule</h4>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {day.events
              .filter(e => e.time.includes("PM"))
              .map((event, i) => (
                <motion.div
                  key={`${activeDay}-evening-${i}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 + 0.2 }}
                  className="flex gap-4 rounded-xl p-4 bg-[rgba(255,252,248,0.9)]"
                  style={{
                    border: `1px solid ${day.accent}18`,
                    boxShadow: "0 2px 10px rgba(44,24,16,0.05)",
                  }}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 text-center min-w-[70px]">
                    <div
                      className="rounded-lg px-2 py-1 mb-1"
                      style={{ background: day.accent }}
                    >
                      <p className={`${cinzel.className} text-[0.6rem] font-semibold text-white tracking-[0.05em]`}>
                        {event.time}
                      </p>
                    </div>
                    <span className="text-2xl">{event.icon}</span>
                  </div>

                  {/* Divider */}
                  <div className="w-[2px] flex-shrink-0 rounded-[2px]" style={{ background: `${day.accent}25` }} />

                  {/* Content */}
                  <div>
                    <h4 className={`${cormorant.className} text-[1.1rem] font-bold text-[#2c1810] mb-1`}>
                      {event.title}
                    </h4>
                    <p className={`${lora.className} text-[0.82rem] leading-[1.6] text-[#7a5040]`}>
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Venue note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/75 border border-[rgba(192,57,43,0.15)] backdrop-blur-[8px]">
            <span>📍</span>
            <p className={`${lora.className} text-[0.88rem] text-[#7a5040]`}>
              <span className="font-semibold text-[#c0392b]">Ram Leela Ground, Noida</span> · Free Entry · Morning 10AM - Evening 10:30PM
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}