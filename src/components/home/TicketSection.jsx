"use client";

import Image from "next/image";
import { Playfair_Display, Cinzel } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const TicketSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 overflow-hidden">
      
      {/* Kalash Image - Right Side - Blended */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 lg:w-2/5 opacity-40 md:opacity-80">
        <div className="relative w-full h-full">
          <Image
            src="/kalash.png"
            alt="Traditional Kalash"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-amber-200/50 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Decorative Background Glow */}
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl"></div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center md:h-[420px]">

          {/* Mandala Left */}
          <div className="relative w-full md:w-auto flex justify-center md:justify-start overflow-hidden md:overflow-visible py-2 md:py-0">
            <div className="relative w-[280px] h-[280px] md:w-[450px] md:h-[490px] md:ml-[-200px]">
              <Image
                src="/mandala.png"
                alt="Decorative mandala"
                fill
                className="object-contain drop-shadow-2xl animate-[spin_60s_linear_infinite]"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left px-6 md:px-12 lg:px-16 pb-1 pt-2 md:pt-8 md:py-0 relative z-20">

            {/* Top Label */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-rose-400"></div>
              <span className="text-rose-600 text-xs font-semibold tracking-wider uppercase">
                Raja Parba 2026
              </span>
              <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-rose-400"></div>
            </div>

            {/* Title */}
            <h2
              className={`${playfair.className} text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight drop-shadow-sm`}
            >
              The Festival of Womanhood & Earth
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-base md:text-lg mb-6 max-w-2xl md:mx-0 mx-auto font-medium leading-relaxed">
              Raja is not just a celebration — it is Odisha’s tribute to
              womanhood, nature, and tradition. For three vibrant days,
              swings decorate courtyards, delicious pithas fill homes,
              and the Earth herself is honored as she rests and renews.
              It is a time of joy, togetherness, and cultural pride . . .
            </p>

            {/* CTA Button */}
            <div className="flex items-center justify-center md:justify-start">
              <button className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-800 via-red-400 to-red-900 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <span className="text-xl">🌸</span>
                  <span className={`${cinzel.className} text-sm md:text-base`}>
                    Explore the Culture Behind ... 
                  </span>
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Dots Decoration */}
        <div className="flex justify-center py-3 gap-1.5">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === 3
                  ? "bg-purple-500 scale-125"
                  : i === 2 || i === 4
                  ? "bg-rose-400 scale-110"
                  : "bg-pink-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TicketSection;
