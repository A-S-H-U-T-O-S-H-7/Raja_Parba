// components/about/FourDaysSection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sun } from "lucide-react";

const days = [
  {
    name: "Pahili Raja",
    meaning: "The First Day",
    description: "Homes awaken to the aroma of new clothes and turmeric. Girls rise before the sun, bathe, and adorn themselves. The world pauses to watch them shine.",
    color: "amber",
    icon: "🌅"
  },
  {
    name: "Mithuna Sankranti",
    meaning: "The Main Day",
    description: "The Earth bleeds and rests. Swings are tied to ancient banyan trees. Laughter fills the air. No one walks on soil — it's given complete rest.",
    color: "green",
    icon: "🌿"
  },
  {
    name: "Basi Raja",
    meaning: "The Day After",
    description: "Leftover feasts taste sweeter. Games of cards and ludo stretch into night. Girls glow in their finest, knowing they are seen, celebrated, and loved.",
    color: "rose",
    icon: "🎲"
  },
  {
    name: "Basumati Snana",
    meaning: "Earth's Bath",
    description: "On the final day, the Earth is bathed with ritual water. Farmers whisper gratitude. The soil is now ready — for sowing, for rain, for new life.",
    color: "blue",
    icon: "💧"
  }
];

export default function FourDaysSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-4 bg-gradient-to-b from-[#F5E6D3] to-[#E8D5B5] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #7A0000 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-6">
            <Sun className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 font-medium">FOUR DAYS OF CELEBRATION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
            Each Dawn, A New Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Raja doesn&apos;t arrive in a day. It unfolds, like a monsoon flower blooming petal by petal, each dawn bringing its own sacred ritual.
          </p>
        </motion.div>

        {/* Timeline Days */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-300 via-rose-300 to-green-300 transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {days.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative"
              >
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-t-4 border-${day.color}-400 hover:shadow-2xl transition-all duration-300 group`}>
                  {/* Day Number */}
                  <div className={`absolute -top-4 -right-2 w-12 h-12 bg-${day.color}-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {idx + 1}
                  </div>
                  
                  <div className="text-5xl mb-4">{day.icon}</div>
                  <h3 className="text-2xl font-bold text-[#2C1810] mb-2">{day.name}</h3>
                  <p className={`text-${day.color}-600 font-medium text-sm mb-4`}>{day.meaning}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/60 backdrop-blur-sm px-8 py-4 rounded-full border border-amber-200">
            <p className="text-gray-700">
              <span className="font-bold text-rose-600">Three days of rest, one day of gratitude — </span>
              A rhythm as old as the Earth itself.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}