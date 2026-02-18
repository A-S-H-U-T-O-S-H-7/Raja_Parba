"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import HeroSection from "./HeroSection";
import SacredBondSection from "./SacredBondSection";
import FourDaysSection from "./FourDaysSection";
import FlavorsSection from "./FlavorsSection";
import FarmersSection from "./FarmersSection";
import MemoriesSection from "./MemoriesSection";


export default function AboutPage() {
  const containerRef = useRef(null);
  useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="bg-[#FDF2E9] text-gray-800 overflow-x-hidden">
      <SacredBondSection />
      <FourDaysSection />
            <HeroSection />

      <FlavorsSection />
      <FarmersSection />
      <MemoriesSection />
    </div>
  );
}