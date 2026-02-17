// components/about/FlavorsSection.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Wheat } from "lucide-react";

const foods = [
  {
    name: "Poda Pitha",
    description: "Burned on the outside, soft within — like memories that scar and soothe. Baked overnight in earth ovens, its smoky sweetness is the taste of anticipation.",
    icon: "🔥",
    image: "/images/poda-pitha.png"
  },
  {
    name: "Manda Pitha",
    description: "Steamed rice dumplings hiding sweet coconut-jaggery hearts. Each bite is a surprise — soft, warm, dissolving like childhood.",
    icon: "🥟",
    image: "/images/manda-pitha.png"
  },
  {
    name: "Chakuli Pitha",
    description: "Crispy, golden, paper-thin — served with bubbling hot curry. The crunch of celebration, the comfort of home.",
    icon: "🫓",
    image: "/images/chakuli-pitha.png"
  },
  {
    name: "Pana",
    description: "A sweet drink of milk, banana, and palm sugar. Cool as monsoon breeze, sweet as the days themselves.",
    icon: "🥛",
    image: "/images/pana.png"
  },
  {
    name: "Arisha Pitha",
    description: "Deep-fried rice flour discs, caramelized and crisp. The sound of frying oil is the music of Raja kitchens.",
    icon: "🍪",
    image: "/images/arisha-pitha.png"
  },
  {
    name: "Chenna Poda",
    description: "Odisha's gift to the world — caramelized cottage cheese burnt to perfection. A dessert that tastes like joy itself.",
    icon: "🍰",
    image: "/images/chenna-poda.png"
  }
];

export default function FlavorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-4 bg-gradient-to-b from-[#E8D5B5] to-[#F5E6D3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
            <Wheat className="w-4 h-4 text-orange-600" />
            <span className="text-orange-700 font-medium">TASTE OF TRADITION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
            Flavors That Remember
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every pitha, every sweet, every sip of pana carries a story. Not just of recipes, but of hands that prepared them, generations that passed them down, and hearts that still crave them.
          </p>
        </motion.div>

        {/* Food Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full bg-gradient-to-br from-amber-100 to-orange-100">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{food.icon}</span>
                  <h3 className="text-xl font-bold text-[#2C1810]">{food.name}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{food.description}</p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-tl-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}