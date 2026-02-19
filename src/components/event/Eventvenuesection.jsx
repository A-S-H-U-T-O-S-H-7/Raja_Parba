"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cinzel, Cormorant_Garamond, Lora } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const faqs = [
  { q: "Is entry free?", a: "Yes — all 3 days are completely free to attend. Some competitions may have nominal registration fees." },
  { q: "Who can participate in Raja Kumari?", a: "Girls of Odia heritage aged 16–30, residing in Delhi NCR. Open registrations from 1st June 2026." },
  { q: "Who can join the Fancy Dress?", a: "Anyone! Open to all ages. Dress as an Odia deity, festival character, or folk tradition." },
  { q: "Are stalls open all 3 days?", a: "Yes. The Odia Stall Bazaar runs all 3 evenings from 5:00 PM to 11:00 PM." },
];

export default function EventVenueSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-10 px-4 bg-gradient-to-br from-[#fefaf5] via-[#fdf4ec] to-[#fefaf5]"
    >
      {/* Light grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
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
          <div className="mb-2 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-[#c0392b] opacity-30" />
            <span className={`${cinzel.className} text-xs font-semibold tracking-[0.22em] uppercase text-[#c0392b]`}>
              Venue & Info
            </span>
            <div className="h-px w-8 bg-[#c0392b] opacity-30" />
          </div>
          <h2 className={`${cormorant.className} text-2xl md:text-3xl font-bold text-[#2c1810]`}>
            Find Us at{" "}
            <span className="italic bg-gradient-to-r from-[#c0392b] to-[#8b3a8f] bg-clip-text text-transparent">
              Ram Leela Ground
            </span>
          </h2>
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column - Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="space-y-4"
          >
            {/* Map placeholder */}
            <div className="relative overflow-hidden rounded-xl h-[160px] bg-white/80 border border-[#c0392b]/20 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-1">🗺️</div>
                <p className={`${cinzel.className} text-xs tracking-[0.15em] uppercase text-[#c0392b]`}>
                  Ram Leela Ground, Noida
                </p>
                <p className={`${lora.className} text-sm text-[#6b4c38] mt-1`}>
                  Sector 21A, Noida, Uttar Pradesh
                </p>
              </div>
            </div>

            {/* Info cards - 2x2 grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📅", label: "Dates", val: "13 – 15 June 2026" },
                { icon: "🕕", label: "Time", val: "5:00 PM – 11:00 PM" },
                { icon: "📍", label: "Venue", val: "Ram Leela Ground" },
                { icon: "🎟️", label: "Entry", val: "Free — All 3 Days" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3 bg-white/80 border border-[#c0392b]/10 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl block mb-1">{item.icon}</span>
                  <p className={`${cinzel.className} text-[0.6rem] tracking-[0.15em] uppercase text-[#c0392b] mb-0.5`}>
                    {item.label}
                  </p>
                  <p className={`${lora.className} text-sm font-medium text-[#2c1810] leading-tight`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="space-y-4"
          >
            <h3 className={`${cormorant.className} text-xl md:text-2xl font-bold text-[#2c1810] flex items-center gap-2`}>
              <span className="w-1 h-6 bg-gradient-to-b from-[#c0392b] to-[#8b3a8f] rounded-full" />
              <span className="bg-gradient-to-r from-[#c0392b] to-[#8b3a8f] bg-clip-text text-transparent">
                Quick Answers
              </span>
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg p-3 bg-white/80 border border-[#8b3a8f]/10 shadow-sm hover:shadow-md transition-shadow">
                  <p className={`${cormorant.className} text-base font-bold text-[#c0392b] mb-1`}>
                    {faq.q}
                  </p>
                  <p className={`${lora.className} text-sm leading-normal text-[#6b4c38]`}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="mt-6 rounded-xl px-5 py-4 bg-white/90 border border-[#e8a87c]/30 shadow-sm backdrop-blur-[4px]"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-left w-full md:w-auto">
              <p className={`${cinzel.className} text-[0.65rem] tracking-[0.22em] uppercase text-[#c0392b] mb-0.5`}>
                Mark Your Calendar
              </p>
              <h3 className={`${cormorant.className} text-xl md:text-2xl font-bold text-[#2c1810]`}>
                Raja Mahotsav 2026
              </h3>
              <p className={`${lora.className} text-sm text-[#6b4c38]`}>
                13 – 15 June · Free Entry
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
              
              <button className={`${cinzel.className} px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase rounded-md transition-all duration-300 hover:bg-[#c0392b]/5 bg-transparent text-[#c0392b] border border-[#c0392b]/30`}>
                Share
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}