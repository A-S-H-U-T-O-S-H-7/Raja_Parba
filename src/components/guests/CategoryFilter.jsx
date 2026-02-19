"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cinzel, Cormorant_Garamond } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function CategoryFilter({ selectedCategory, onCategoryChange, counts }) {
  const categories = [
    { 
      id: 'all', 
      label: 'All Friends', 
      icon: '✦', 
      gradient: 'from-[#C9A96E] to-[#8B6B45]',
      bgLight: 'bg-[#FDF6E8]',
      borderGlow: 'border-[#C9A96E]/30'
    },
    { 
      id: 'spiritual', 
      label: 'Soulful Souls', 
      icon: '🕊️', 
      gradient: 'from-[#9CAF88] to-[#6B8E6B]',
      bgLight: 'bg-[#F0F4E8]',
      borderGlow: 'border-[#9CAF88]/30'
    },
    { 
      id: 'artist', 
      label: 'Creative Hearts', 
      icon: '🎨', 
      gradient: 'from-[#D4A5A5] to-[#B88A8A]',
      bgLight: 'bg-[#FDF0F0]',
      borderGlow: 'border-[#D4A5A5]/30'
    },
    { 
      id: 'special', 
      label: 'Special Ones', 
      icon: '✧', 
      gradient: 'from-[#B8A99A] to-[#8F7A68]',
      bgLight: 'bg-[#F5F0E8]',
      borderGlow: 'border-[#B8A99A]/30'
    },
  ];

  return (
    <div className="relative">
      {/* Decorative top line */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C9A96E]" />
          <span className={`${cinzel.className} text-[#C9A96E] text-[0.6rem] tracking-[0.35em] uppercase`}>
            Categories
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C9A96E]" />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                scale: 1.03,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category.id)}
              className="relative group"
            >
              {/* Soft glow background */}
              <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                isSelected ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
              }`}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${category.gradient.split(' ')[0].replace('from-', '')}, ${category.gradient.split(' ')[1].replace('to-', '')})`
                  : category.gradient
              }}
              />
              
              {/* Main button */}
              <div
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-500 ${
                  isSelected 
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg` 
                    : `${category.bgLight} text-[#5D4A36] hover:shadow-md`
                }`}
                style={{
                  border: isSelected 
                    ? '1px solid rgba(255,255,255,0.2)' 
                    : `1px solid ${category.borderGlow.split(' ')[1].replace(']', '').replace('[', '')}`,
                  boxShadow: isSelected 
                    ? '0 4px 20px -8px rgba(139,107,69,0.3)' 
                    : '0 2px 10px -5px rgba(0,0,0,0.05)'
                }}
              >
                <span className="flex items-center gap-3">
                  {/* Icon with subtle animation */}
                  <motion.span
                    animate={isSelected ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 2,
                      repeat: isSelected ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                    className={`${!isSelected && 'opacity-75'} text-lg`}
                    style={{
                      fontFamily: !category.icon.includes('🕊️') && !category.icon.includes('🎨') ? cinzel.className : 'inherit'
                    }}
                  >
                    {category.icon}
                  </motion.span>
                  
                  {/* Label */}
                  <span className={`${cormorant.className} tracking-wide`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    {category.label}
                  </span>
                  
                  {/* Count badge */}
                  {category.id !== 'all' && counts[category.id] > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#E8D9BF] text-[#8B6B45]'
                      }`}
                      style={{
                        fontFamily: cinzel.className,
                      }}
                    >
                      {counts[category.id]}
                    </motion.span>
                  )}
                </span>
              </div>

              {/* Decorative corner accents for selected state */}
              {isSelected && (
                <>
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/40 rounded-tl-full" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white/40 rounded-tr-full" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white/40 rounded-bl-full" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/40 rounded-br-full" />
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Subtle decorative element at bottom */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: '100px' }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent"
      />
    </div>
  );
}