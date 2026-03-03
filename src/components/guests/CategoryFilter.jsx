"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CINZEL_FONT = "'Cinzel', 'Times New Roman', serif";
const CORMORANT_FONT = "'Cormorant Garamond', 'Times New Roman', serif";

export default function CategoryFilter({ selectedCategory, onCategoryChange, counts }) {
  const categories = [
    {
      id: 'all',
      label: 'All Friends',
      icon: 'All',
      gradient: 'from-[#C9A96E] to-[#8B6B45]',
      bgLight: 'bg-[#FDF6E8]',
      borderGlow: 'border-[#C9A96E]/30'
    },
    {
      id: 'spiritual',
      label: 'Soulful Souls',
      icon: 'D',
      gradient: 'from-[#9CAF88] to-[#6B8E6B]',
      bgLight: 'bg-[#F0F4E8]',
      borderGlow: 'border-[#9CAF88]/30'
    },
    {
      id: 'artist',
      label: 'Creative Hearts',
      icon: 'Art',
      gradient: 'from-[#D4A5A5] to-[#B88A8A]',
      bgLight: 'bg-[#FDF0F0]',
      borderGlow: 'border-[#D4A5A5]/30'
    },
    {
      id: 'special',
      label: 'Special Ones',
      icon: 'S',
      gradient: 'from-[#B8A99A] to-[#8F7A68]',
      bgLight: 'bg-[#F5F0E8]',
      borderGlow: 'border-[#B8A99A]/30'
    },
  ];

  return (
    <div className="relative">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C9A96E]" />
          <span
            className="text-[#C9A96E] text-[0.6rem] tracking-[0.35em] uppercase"
            style={{ fontFamily: CINZEL_FONT }}
          >
            Categories
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C9A96E]" />
        </div>
      </div>

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
              <div
                className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
                  isSelected ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
                }`}
              />

              <div
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-500 ${
                  isSelected
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : `${category.bgLight} text-[#5D4A36] hover:shadow-md`
                }`}
                style={{
                  border: isSelected
                    ? '1px solid rgba(255,255,255,0.2)'
                    : '1px solid rgba(201,169,110,0.3)',
                  boxShadow: isSelected
                    ? '0 4px 20px -8px rgba(139,107,69,0.3)'
                    : '0 2px 10px -5px rgba(0,0,0,0.05)'
                }}
              >
                <span className="flex items-center gap-3">
                  <motion.span
                    animate={isSelected ? { rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: isSelected ? Infinity : 0, ease: "easeInOut" }}
                    className={`${!isSelected && 'opacity-75'} text-sm`}
                    style={{ fontFamily: CINZEL_FONT }}
                  >
                    {category.icon}
                  </motion.span>

                  <span
                    className="tracking-wide"
                    style={{ fontFamily: CORMORANT_FONT, fontSize: '1rem', fontWeight: isSelected ? 500 : 400 }}
                  >
                    {category.label}
                  </span>

                  {category.id !== 'all' && counts[category.id] > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#E8D9BF] text-[#8B6B45]'
                      }`}
                      style={{ fontFamily: CINZEL_FONT }}
                    >
                      {counts[category.id]}
                    </motion.span>
                  )}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: '100px' }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent"
      />
    </div>
  );
}
