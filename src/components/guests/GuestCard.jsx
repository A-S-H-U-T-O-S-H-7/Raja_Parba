"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Cinzel, Cormorant_Garamond } from "next/font/google";

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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const colorSchemes = {
  spiritual: {
    accent: "#7C5C3E",
    light: "#FBF5EE",
    border: "#DCC9B0",
    badge: "SPIRITUAL",
    ornament: "✦",
  },
  artist: {
    accent: "#8B3A3A",
    light: "#FDF5F5",
    border: "#DDB8B8",
    badge: "ARTISAN",
    ornament: "❧",
  },
  special: {
    accent: "#3A5A4A",
    light: "#F5FAF7",
    border: "#B0D0BC",
    badge: "DISTINGUISHED",
    ornament: "◆",
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

  const scheme = colorSchemes[guest.category] || colorSchemes.spiritual;
  const imgSrc = imgError || !guest.imageUrl ? getAvatar(guest.name, guest.category) : guest.imageUrl;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="relative"
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: scheme.light,
          border: `1px solid ${scheme.border}`,
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.9) inset",
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(to right, ${scheme.border}, ${scheme.accent}, ${scheme.border})`,
          }}
        />

        {/* Corner ornaments */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} pointer-events-none`}
            style={{ color: scheme.border, fontSize: 8, opacity: 0.8 }}
          >
            ✦
          </span>
        ))}

        <div className="px-6 pt-7 pb-6 flex flex-col items-center text-center">

          {/* Category Badge */}
          <div
            className="mb-5 px-4 py-1"
            style={{
              border: `1px solid ${scheme.border}`,
              color: scheme.accent,
              fontFamily: cinzel.style.fontFamily,
              fontSize: 9,
              letterSpacing: "0.25em",
              fontWeight: 600,
            }}
          >
            {scheme.badge}
          </div>

          {/* Portrait */}
          <div className="relative mb-5">
            <div
              className="rounded-full p-[2px]"
              style={{ background: `linear-gradient(135deg, ${scheme.accent}66, ${scheme.border})` }}
            >
              <div className="rounded-full p-[3px] bg-white">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={guest.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
              </div>
            </div>

            {guest.isExpected && (
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: scheme.accent }}
                title="Expected"
              >
                ⏳
              </div>
            )}
          </div>

          {/* Name */}
          <h3
            className="text-gray-800 leading-snug mb-0.5"
            style={{
              fontFamily: playfair.style.fontFamily,
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
          >
            {guest.name}
          </h3>

          {/* Inline ornamental divider */}
          <div className="flex items-center justify-center gap-3 my-2">
            <div style={{ height: 1, width: 32, background: `linear-gradient(to right, transparent, ${scheme.accent})` }} />
            <span style={{ color: scheme.accent, fontSize: 9, letterSpacing: 4 }}>✦</span>
            <div style={{ height: 1, width: 32, background: `linear-gradient(to left, transparent, ${scheme.accent})` }} />
          </div>

          {/* Title */}
          <p
            className="mb-4 uppercase"
            style={{
              color: scheme.accent,
              fontFamily: cinzel.style.fontFamily,
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              fontWeight: 500,
            }}
          >
            {guest.title}
          </p>

          {/* Description */}
          <p
            className="text-gray-600 leading-relaxed mb-4"
            style={{
              fontFamily: cormorant.style.fontFamily,
              fontSize: "1.05rem",
              fontStyle: "italic",
            }}
          >
            {guest.description}
          </p>

          {/* Significance */}
          {guest.significance && (
            <div
              className="w-full pt-4"
              style={{ borderTop: `1px solid ${scheme.border}` }}
            >
              <p
                style={{
                  color: scheme.accent,
                  fontFamily: cormorant.style.fontFamily,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  opacity: 0.85,
                }}
              >
                <span className="mr-1.5" style={{ fontSize: 10 }}>{scheme.ornament}</span>
                {guest.significance}
              </p>
            </div>
          )}
        </div>

        {/* Hover bottom bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 2,
            background: `linear-gradient(to right, transparent, ${scheme.accent}, transparent)`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}