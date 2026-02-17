// components/about/SacredBondSection.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";

export default function SacredBondSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32 px-4 bg-gradient-to-b from-[#FDF2E9] to-[#F5E6D3] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[600px] w-full">
              <Image
                src="/images/womanhood.png"
                alt="Womanhood and Earth"
                fill
                className="object-contain"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-10 -right-10 text-7xl"
              animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              🌸
            </motion.div>
            <motion.div 
              className="absolute -bottom-10 -left-10 text-7xl"
              animate={{ rotate: [0, -10, 10, 0], y: [0, 10, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            >
              🌿
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 text-rose-600" />
              <span className="text-rose-700 font-medium text-sm">THE SACRED BOND</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] leading-tight">
              Womanhood & Basudha — 
              <span className="text-rose-700"> Two Souls, One Rhythm</span>
            </h2>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                In the quiet wisdom of Odisha, <span className="font-semibold text-rose-700">Basudha — Mother Earth — is never just soil.</span> She breathes. She bleeds. She creates. And for three sacred days of Raja, she rests.
              </p>
              
              <p className="pl-6 border-l-4 border-rose-400 italic text-gray-600">
                &quot;Just as a woman is honored during her cycle, the Earth too is given pause — a reminder that creation demands reverence, not exploitation.&quot;
              </p>
              
              <p>
                This is not mythology. This is ecology wrapped in emotion. When we celebrate Raja, we don&apos;t just mark a season. 
                <span className="font-semibold text-[#2C1810]"> We acknowledge that the ground beneath our feet is alive — and like every living being, it deserves moments of rest, respect, and celebration.</span>
              </p>

              <p>
                Raja teaches daughters they are powerful. It teaches sons to respect that power. In every swing that flies high, in every new dress worn with pride, Odisha whispers to its girls: 
                <span className="font-bold text-rose-700"> &quot;You are Earth. You are sacred. You are celebrated.&quot;</span>
              </p>
            </div>

            {/* Stats/Quote Box */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-rose-200">
                <div className="text-3xl font-bold text-rose-700">3 Days</div>
                <div className="text-sm text-gray-600">Of sacred rest for Mother Earth</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-rose-200">
                <div className="text-3xl font-bold text-rose-700">∞</div>
                <div className="text-sm text-gray-600">Generations of wisdom</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}