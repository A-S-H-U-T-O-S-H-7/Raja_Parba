// components/about/MemoriesSection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";

const memories = [
  {
    text: "The smell of rain on dry earth, the first time after months of waiting.",
    icon: "🌧️"
  },
  {
    text: "Grandmother's hands, shaping pithas before sunrise, flour dust like blessings on her fingers.",
    icon: "👵"
  },
  {
    text: "The creak of ropes on mango branches, swinging higher, touching the sky.",
    icon: "🌿"
  },
  {
    text: "Alta drying on feet, mehndi blooming on palms — red promises of beauty and pride.",
    icon: "🌸"
  },
  {
    text: "Laughter that didn't end, games that stretched into night, childhood remembered.",
    icon: "🎲"
  },
  {
    text: "The quiet after the storm — farmers looking at clouds, knowing it's time.",
    icon: "🌾"
  }
];

export default function MemoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-4 bg-gradient-to-b from-[#FDF2E9] to-[#F5E6D3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-rose-700 font-medium">ETERNAL MEMORIES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
            Raja Lives Forever
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The festival ends. The swings come down. The pithas are finished. But Raja never leaves — it settles deep, in the quiet corners where memory lives.
          </p>
        </motion.div>

        {/* Memory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <span className="text-5xl mb-4 block">{memory.icon}</span>
                <p className="text-gray-700 text-lg leading-relaxed">{memory.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-9xl font-serif">&quot;</span>
          </div>
          <div className="relative bg-white/30 backdrop-blur-sm p-12 rounded-3xl border border-amber-200">
            <p className="text-2xl md:text-3xl italic text-[#2C1810] max-w-4xl mx-auto">
              Raja is not just a festival. It is Odisha&apos;s way of saying: 
              <span className="font-bold text-rose-700"> Rest, daughter. You are loved. You are earth. You are eternal.</span>
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="w-2 h-2 bg-rose-500 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}