"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
const colorSchemes = {
  spiritual: {
    gradient: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-900",
  },
  artist: {
    gradient: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-900",
  },
  special: {
    gradient: "from-blue-700 to-indigo-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
  },
};

function getAvatar(name, category) {
  const palette = { spiritual: "B8956A", artist: "C4706A", special: "6A9B7E" };
  const bg = palette[category] || "B8956A";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200&bold=true`;
}

export default function GuestCard({ guest }) {
  const [imgError, setImgError] = useState(false);
  if (!guest) return null;

  const category = colorSchemes[guest.category] || colorSchemes.spiritual;
  const imgSrc = imgError || !guest.imageUrl ? getAvatar(guest.name, guest.category) : guest.imageUrl;

  return (
    <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className={`${category.bgColor} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/70 h-full`}>
      <div
        className="h-full"
      >
        <div className="p-3 sm:p-4">
          <div className="flex flex-col items-center text-center sm:hidden">
            <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${category.gradient} p-0.5 mb-4`}>
              <div className="w-full h-full rounded-full bg-white p-1">
                <img
                  src={imgSrc}
                  alt={guest.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <h3 className={`font-bold text-base leading-tight mb-2 ${category.textColor}`}>{guest.name}</h3>
              <p className={`text-sm font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent mb-3`}>
                {guest.title}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{guest.description}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-start gap-5">
            <div className={`flex-shrink-0 w-28 h-28 rounded-full bg-gradient-to-br ${category.gradient} p-0.5`}>
              <div className="w-full h-full rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={guest.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg leading-tight mb-2 ${category.textColor}`}>{guest.name}</h3>
              <p className={`text-base font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent mb-3`}>
                {guest.title}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{guest.description}</p>
            </div>
          </div>

          {guest.isExpected && (
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                Expected Guest
              </span>
            </div>
          )}

          {guest.significance && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                <span className="font-semibold text-amber-600">Significance: </span>
                {guest.significance}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
