"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const foods = [
  {
    name: "Poda Pitha",
    description:
      "Burned on the outside, soft within — like memories that scar and soothe. Baked overnight in earth ovens, its smoky sweetness is the taste of anticipation.",
    icon: "🔥",
    image: "/podapithabg.png",
    tag: "Baked",
    tagColor: "#c0392b",
  },
  {
    name: "Manda Pitha",
    description:
      "Steamed rice dumplings hiding sweet coconut-jaggery hearts. Each bite is a surprise — soft, warm, dissolving like childhood.",
    icon: "🥟",
    image: "/mandapithabg.png",
    tag: "Steamed",
    tagColor: "#2d6a4f",
  },
  {
    name: "Chakuli Pitha",
    description:
      "Crispy, golden, paper-thin — served with bubbling hot curry. The crunch of celebration, the comfort of home.",
    icon: "🫓",
    image: "/chakulibg.png",
    tag: "Crispy",
    tagColor: "#b5451b",
  },
  {
    name: "Pana",
    description:
      "A sweet drink of milk, banana, and palm sugar. Cool as monsoon breeze, sweet as the days themselves.",
    icon: "🥛",
    image: "/panabg2.png",
    tag: "Drink",
    tagColor: "#1a6b8a",
  },
  {
  name: "Mitha Paan",
  description:
    "Fresh betel leaves filled with gulkand, fennel seeds, coconut, and sweet supari. Mitha Paan is a fragrant and flavorful traditional mouth freshener enjoyed during Raja celebrations.",
  icon: "🍃",
  image: "/PAAN-1.jpg",
  tag: "Traditional",
  tagColor: "#2e7d32",
},

  {
    name: "Chenna Poda",
    description:
      "Odisha's gift to the world — caramelized cottage cheese burnt to perfection. A dessert that tastes like joy itself.",
    icon: "🍰",
    image: "/chenapodabg.png",
    tag: "Signature",
    tagColor: "#7a2d6b",
  },
];

export default function FlavorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-8 px-4"
      style={{
        background:
          "linear-gradient(150deg, #f5e8d0 0%, #eedad8 35%, #f0e2cc 65%, #ecddd0 100%)",
      }}
    >
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "120px",
        }}
      />

      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #e8a87c 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #c0392b 0%, transparent 70%)" }}
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
            <div className="h-px w-10 bg-[#b5451b] opacity-50" />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b5451b",
              }}
            >
              Taste of Tradition
            </span>
            <div className="h-px w-10 bg-[#b5451b] opacity-50" />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#2c1810",
            }}
          >
            Flavors That{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(90deg, #b5451b, #e8a87c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Remember
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#7a5040",
              maxWidth: "36rem",
              margin: "0.75rem auto 0",
            }}
          >
            Every pitha, every sip of pana carries a story — not just of recipes,
            but of hands that prepared them and hearts that still crave them.
          </p>
        </motion.div>

        {/* ── Food Grid ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "rgba(255,252,248,0.88)",
                border: "1px solid rgba(181,69,27,0.12)",
                boxShadow: "0 2px 16px rgba(44,24,16,0.07)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Image strip */}
              <div
                className="relative h-62 w-full overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #fdf0e8 0%, #f5e2d0 100%)",
                }}
              >
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  className="object-cover p-2 transition-transform rounded-lg duration-700 group-hover:scale-105"
                />

                {/* Tag badge */}
                <div
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-white"
                  style={{
                    background: food.tagColor,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {food.tag}
                </div>

                {/* Bottom gradient bleed */}
                <div
                  className="absolute inset-x-0 bottom-0 h-8"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(255,252,248,0.95), transparent)",
                  }}
                />
              </div>

              {/* Content */}
              <div className="px-3 pb-2 pt-2">
                <div className="mb-2 flex items-center gap-2">
                  <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{food.icon}</span>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#2c1810",
                    }}
                  >
                    {food.name}
                  </h3>
                </div>

                {/* Accent line */}
                <div
                  style={{
                    height: "1px",
                    width: "2rem",
                    background: food.tagColor,
                    opacity: 0.4,
                    marginBottom: "0.6rem",
                  }}
                />

                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.75,
                    color: "#6b4c38",
                  }}
                >
                  {food.description}
                </p>
              </div>

              {/* Hover glow corner */}
              <div
                className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-tl-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at bottom right, ${food.tagColor}22, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Bottom quote ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8 text-center"
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              fontStyle: "italic",
              color: "#9a6b50",
            }}
          >
            "In every bite of a pitha, generations speak."
          </p>
        </motion.div>

      </div>
    </section>
  );
}