// components/about/RotatingHeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Cinzel, Cormorant_Garamond } from 'next/font/google';

// Beautiful font options
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

// Additional elegant font option
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const elements = [
  {
    id: 1,
    title: "Poda Pitha",
    description: "The smoky-sweet aroma that wakes up with the sun. Baked overnight in earth ovens, every bite carries generations of love.",
    image: "/podapitha2.png",
    icon: "🔥"
  },
  {
    id: 2,
    title: "Manda Pitha",
    description: "Soft rice dumplings cradling sweet coconut and jaggery. Steamed to perfection, they melt like memories on your tongue.",
    image: "/mandapitha.png",
    icon: "🥟"
  },
  {
    id: 3,
    title: "Raja Doli",
    description: "Swings tied to ancient mango branches. Girls fly high, touching the sky, their laughter becoming the music of monsoon.",
    image: "/rajadoli2.png",
    icon: "🌿"
  },
  {
    id: 4,
    title: "Chenna Poda",
    description: "The cheesecake of Odisha — caramelized, burnt, beautiful. A dessert that tastes like celebration itself.",
    image: "/chenapoda.png",
    icon: "🍰"
  },
  {
    id: 5,
    title: "Alta & Mehndi",
    description: "Red alta tracing poetry on feet. Mehndi blooming like monsoon flowers on open palms. Every girl becomes a goddess.",
    image: "/alata.png",
    icon: "🌸"
  },
  {
    id: 6,
    title: "New Dresses",
    description: "The rustle of new cotton. Bright colors mirroring the rain-washed earth. Raja's first gift to every daughter.",
    image: "/nuadress.png",
    icon: "👗"
  },
  {
    id: 7,
    title: "Ludo & Games",
    description: "Courtyards filled with dice and laughter. Three days where work pauses and play begins. Childhood, relived.",
    image: "/mandir3.png",
    icon: "🎲"
  },
  {
    id: 8,
    title: "Mitha Pana",
    description: "Courtyards filled with dice and laughter. Three days where work pauses and play begins. Childhood, relived.",
    image: "/mithapana.png",
    icon: "🎲"
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % elements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Beautiful gradient background
  const gradientBg = "bg-gradient-to-br from-emerald-500 via-teal-100 to-emerald-600";

  return (
    <section className={`relative h-[550px] md:h-[450px] w-full overflow-hidden ${gradientBg}`}>
      
      {/* MANDALA LEFT - 60% visible */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[480px] h-[300px] md:h-[500px] opacity-30 md:opacity-100 pointer-events-none">
        <div className="relative w-full h-full md:ml-[-150px]">
          <Image
            src="/mandala3.png"
            alt="Decorative mandala"
            fill
            className="object-contain drop-shadow-2xl animate-[spin_50s_linear_infinite_reverse] "
            priority
          />
        </div>
      </div>

      {/* MANDALA RIGHT - subtle accent */}
      <div className="absolute right-0 bottom-0 w-[200px] md:w-[350px] h-[200px] md:h-[350px] opacity-40 pointer-events-none">
        <div className="relative w-full h-full md:mr-[-100px]">
          <Image
            src="/mandala2.png"
            alt="Decorative mandala"
            fill
            className="object-contain drop-shadow-2xl animate-[spin_50s_linear_infinite_reverse]"
          />
        </div>
      </div>

      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-4 border-amber-200/30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-amber-200/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-amber-200/10 rounded-full"></div>
      </div>

      {/* Soft Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute  text-xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              rotate: 0
            }}
            animate={{
              y: [null, -20, 20, -20],
              rotate: 360
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {["🌸", "🌿", "🍂", "🌺", "🌾"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Main Content - Centered vertically */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Content */}
          <motion.div
            key={`content-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{elements[activeIndex].icon}</span>
              <span className={`text-amber-300 font-medium tracking-[0.2em] text-xs uppercase ${cinzel.className}`}>
                The Soul of Raja
              </span>
            </div>
            
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight ${playfair.className}`}>
              {elements[activeIndex].title}
            </h1>
            
            <p className={`text-base sm:text-lg text-amber-50/90 leading-relaxed mb-6 max-w-xl ${cormorant.className}`}>
              {elements[activeIndex].description}
            </p>

            {/* Progress Indicators */}
            <div className="flex gap-2">
              {elements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === activeIndex 
                      ? "w-10 bg-amber-400" 
                      : "w-3 bg-amber-200/30 hover:bg-amber-300/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            key={`image-${activeIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-[220px] sm:h-[280px] md:h-[350px] w-full order-1 lg:order-2"
          >
            {/* Soft glow behind image */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl transform scale-75"></div>
            
            <Image
              src={elements[activeIndex].image}
              alt={elements[activeIndex].title}
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>

      
    </section>
  );
}