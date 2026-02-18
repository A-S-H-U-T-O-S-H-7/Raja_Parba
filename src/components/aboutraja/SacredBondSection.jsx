"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export default function SacredBondSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#1a0a00] py-10"
      style={{
        background:
          "linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0810 100%)",
      }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />

      {/* Radial glow behind image */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[500px] w-[400px] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, #c0392b 0%, #8b1a4a 40%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          
          {/* ── Image Side ── */}
          <motion.div {...fadeUp(0)} className="relative h-[380px] lg:h-[420px]">
            {/* Decorative frame lines */}
            <div className="absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2 border-[#e8a87c] opacity-60" />
            <div className="absolute -bottom-3 -right-3 h-16 w-16 border-b-2 border-r-2 border-[#e8a87c] opacity-60" />

            {/* Image with blend */}
            <div className="relative h-full w-full overflow-hidden rounded-sm">
              <Image
                src="/basudha1.png"
                alt="Womanhood and Basudha"
                fill
                className="object-cover"
                
              />
              {/* Duotone overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(180,50,30,0.35) 0%, rgba(120,20,60,0.5) 60%, rgba(26,8,16,0.7) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>

            {/* Floating emoji accents */}
            <motion.span
              className="absolute -right-4 top-6 text-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🌸
            </motion.span>
            <motion.span
              className="absolute -left-4 bottom-10 text-lg"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
            >
              🌿
            </motion.span>
          </motion.div>

          {/* ── Content Side ── */}
          <div className="flex flex-col gap-5">
            {/* Label */}
            <motion.div {...fadeUp(0.15)} className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#e8a87c]" />
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a87c]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                The Sacred Bond
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              {...fadeUp(0.2)}
              className="text-3xl font-bold leading-tight text-[#f5ede0] lg:text-4xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Womanhood &{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(90deg, #e8a87c, #c0392b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Basudha
              </span>
              <br />
              <span className="text-2xl font-normal text-[#d4b896] lg:text-3xl">
                Two Souls, One Rhythm
              </span>
            </motion.h2>

            {/* Body */}
            <motion.p
              {...fadeUp(0.3)}
              className="text-base leading-relaxed text-amber-100"
              style={{ fontFamily: "'Lora', serif" }}
            >
              In the quiet wisdom of Odisha,{" "}
              <span className="font-semibold text-amber-300">Basudha</span> —
              Mother Earth — is never just soil. She breathes. She bleeds. She
              creates. And for three sacred days of Raja, she rests.
            </motion.p>

            {/* Pull quote */}
            <motion.blockquote
              {...fadeUp(0.38)}
              className="relative border-l-2 border-[#c0392b] pl-4 py-1"
            >
              <p
                className="text-sm italic leading-relaxed text-[#d4b896]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
              >
                "Just as a woman is honored during her cycle, the Earth too is
                given pause — a reminder that creation demands reverence, not
                exploitation."
              </p>
            </motion.blockquote>

            {/* Closing paragraph */}
            <motion.p
              {...fadeUp(0.45)}
              className="text-base leading-relaxed text-amber-100"
              style={{ fontFamily: "'Lora', serif" }}
            >
              This is ecology wrapped in emotion. When we celebrate Raja, we
              acknowledge that the ground beneath our feet is{" "}
              <em>alive</em> — and like every living being, it deserves moments
              of rest and celebration. Raja teaches daughters they are powerful;
              it teaches sons to revere that power.
            </motion.p>

            {/* Stats row */}
            <motion.div
              {...fadeUp(0.55)}
              className="mt-1 flex items-stretch gap-4"
            >
              <div
                className="flex flex-1 flex-col items-center justify-center rounded-sm py-4 px-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(232,168,124,0.2)",
                }}
              >
                <span
                  className="text-3xl font-bold text-[#e8a87c]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  3
                </span>
                <span className="mt-0.5 text-xs uppercase tracking-widest text-[#9a7d5e]">
                  Sacred Days
                </span>
                <span className="mt-1 text-[11px] text-[#7a6045]">
                  of rest for Mother Earth
                </span>
              </div>

              <div
                className="flex flex-1 flex-col items-center justify-center rounded-sm py-4 px-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(192,57,43,0.2)",
                }}
              >
                <span
                  className="text-3xl font-bold text-[#c0392b]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ∞
                </span>
                <span className="mt-0.5 text-xs uppercase tracking-widest text-[#9a7d5e]">
                  Generations
                </span>
                <span className="mt-1 text-[11px] text-[#7a6045]">
                  of living wisdom
                </span>
              </div>

              <div
                className="flex flex-1 flex-col items-center justify-center rounded-sm py-4 px-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(232,168,124,0.15)",
                }}
              >
                <span
                  className="text-3xl font-bold text-[#e8a87c]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  🌸
                </span>
                <span className="mt-0.5 text-xs uppercase tracking-widest text-[#9a7d5e]">
                  Raja Festival
                </span>
                <span className="mt-1 text-[11px] text-[#7a6045]">
                  You are Earth. You are sacred.
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}