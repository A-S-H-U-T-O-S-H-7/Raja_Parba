// components/about/FarmersSection.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { CloudRain, Droplets } from "lucide-react";

export default function FarmersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-32 px-4 bg-gradient-to-b from-[#2C1810] to-[#1F5F3F] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border-8 border-amber-700/30 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border-8 border-amber-700/20 rounded-full"></div>
      </div>

      {/* Rain Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-12 bg-white/10"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -100,
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <CloudRain className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-medium">THE SACRED PAUSE</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Waiting for the 
              <span className="text-amber-400"> First Rain</span>
            </h2>

            <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
              <p>
                When Raja ends, farmers don&apos;t rush to their fields. They wait. They watch the sky. They feel the wind change. 
                <span className="text-amber-300 font-semibold"> Only after Basumati Snana, after the Earth has bathed and rested, do they pick up their plows.</span>
              </p>
              
              <p>
                This is not just agriculture. This is conversation. For generations, Odisha&apos;s farmers have understood that the land is not a machine to be run — it is a mother to be respected. 
                <span className="text-amber-300"> Give her rest, and she gives you abundance.</span>
              </p>
              
              <p>
                The first monsoon rain after Raja is not just water. It is blessing. It is permission. It is the Earth saying, 
                <span className="italic font-semibold"> &quot;I am ready now. Let us create together.&quot;</span>
              </p>
            </div>

            {/* Quote Box */}
            <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-amber-700/30">
              <Droplets className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-xl italic text-amber-200">
                &quot;We don&apos;t sow seeds. We plant gratitude. And gratitude grows best in rested soil.&quot;
              </p>
              <p className="text-sm text-amber-400/80 mt-2">— Odisha farmer&apos;s wisdom</p>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[600px]"
          >
            <Image
              src="/images/monsoon.png"
              alt="Monsoon and Farming"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}