import { useState } from "react";
import { motion } from "framer-motion";

const colorSchemes = {
  spiritual: {
    gradient: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-900",
    svgColor: "#10b981",
    svgColorLight: "#a7f3d0",
  },
  artist: {
    gradient: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-900",
    svgColor: "#f43f5e",
    svgColorLight: "#fecdd3",
  },
  special: {
    gradient: "from-blue-700 to-indigo-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-900",
    svgColor: "#4f46e5",
    svgColorLight: "#c7d2fe",
  },
};

function getAvatar(name, category) {
  const palette = { spiritual: "B8956A", artist: "C4706A", special: "6A9B7E" };
  const bg = palette[category] || "B8956A";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200&bold=true`;
}

function CornerSVG({ color, colorLight, flip }) {
  const id = flip ? "cr" : "cl";
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 pointer-events-none"
      style={{ [flip ? "right" : "left"]: 0, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <defs>
        <linearGradient id={`arcGrad-${id}`} x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colorLight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Concentric quarter-circle arcs (5 layers) */}
      <path d="M0 84 Q0 0 84 0"  stroke={`url(#arcGrad-${id})`} strokeWidth="1.6" fill="none" />
      <path d="M0 66 Q0 0 66 0"  stroke={color} strokeWidth="1.3" fill="none" opacity="0.55" />
      <path d="M0 48 Q0 0 48 0"  stroke={color} strokeWidth="1.1" fill="none" opacity="0.38" />
      <path d="M0 30 Q0 0 30 0"  stroke={color} strokeWidth="0.9" fill="none" opacity="0.25" />
      <path d="M0 14 Q0 0 14 0"  stroke={color} strokeWidth="0.7" fill="none" opacity="0.18" />

      {/* Petal / leaf double flourish */}
      <path d="M2 2 C2 16 16 20 16 20 C16 20 20 6 6 2 Z"  fill={color} opacity="0.16" />
      <path d="M2 2 C16 2 20 16 20 16 C20 16 6 20 2 6 Z"  fill={colorLight} opacity="0.18" />

      {/* Inner petal (tighter) */}
      <path d="M2 2 C2 9 9 12 9 12 C9 12 12 4 4 2 Z"  fill={color} opacity="0.28" />
      <path d="M2 2 C9 2 12 9 12 9 C12 9 4 12 2 4 Z"  fill={color} opacity="0.22" />

      {/* Corner anchor dot */}
      <circle cx="5" cy="5" r="3"   fill={color}  opacity="0.85" />
      <circle cx="5" cy="5" r="1.3" fill="white"  opacity="0.90" />

      {/* Dot trail top edge */}
      <circle cx="18" cy="3.5" r="1.8" fill={color}      opacity="0.45" />
      <circle cx="30" cy="3.5" r="1.3" fill={color}      opacity="0.28" />
      <circle cx="42" cy="3.5" r="0.9" fill={colorLight} opacity="0.30" />
      <circle cx="54" cy="3.5" r="0.7" fill={color}      opacity="0.18" />

      {/* Dot trail left edge */}
      <circle cx="3.5" cy="18" r="1.8" fill={color}      opacity="0.45" />
      <circle cx="3.5" cy="30" r="1.3" fill={color}      opacity="0.28" />
      <circle cx="3.5" cy="42" r="0.9" fill={colorLight} opacity="0.30" />
      <circle cx="3.5" cy="54" r="0.7" fill={color}      opacity="0.18" />

      {/* Diamond accents top edge */}
      <rect width="5.5" height="5.5" rx="0.7" transform="translate(22,6) rotate(45 2.75 2.75)" fill={color} opacity="0.32" />
      <rect width="4"   height="4"   rx="0.5" transform="translate(36,7) rotate(45 2 2)"       fill={colorLight} opacity="0.35" />
      <rect width="3"   height="3"   rx="0.4" transform="translate(49,7.5) rotate(45 1.5 1.5)" fill={color} opacity="0.22" />

      {/* Diamond accents left edge */}
      <rect width="5.5" height="5.5" rx="0.7" transform="translate(6,22) rotate(45 2.75 2.75)" fill={color} opacity="0.32" />
      <rect width="4"   height="4"   rx="0.5" transform="translate(7,36) rotate(45 2 2)"       fill={colorLight} opacity="0.35" />
      <rect width="3"   height="3"   rx="0.4" transform="translate(7.5,49) rotate(45 1.5 1.5)" fill={color} opacity="0.22" />

      {/* Tiny star at corner */}
      <path d="M5 0.5 L5.7 2.8 L8.2 2.8 L6.2 4.3 L6.9 6.6 L5 5.1 L3.1 6.6 L3.8 4.3 L1.8 2.8 L4.3 2.8 Z" fill={color} opacity="0.55" />

      {/* Cross accent on diagonal */}
      <line x1="22" y1="22" x2="27" y2="22" stroke={color} strokeWidth="1.0" opacity="0.30" strokeLinecap="round" />
      <line x1="24.5" y1="19.5" x2="24.5" y2="24.5" stroke={color} strokeWidth="1.0" opacity="0.30" strokeLinecap="round" />

      {/* Second tiny star on diagonal */}
      <path d="M36 31 L36.5 32.5 L38 32.5 L36.9 33.4 L37.4 35 L36 34 L34.6 35 L35.1 33.4 L34 32.5 L35.5 32.5 Z" fill={colorLight} opacity="0.50" />

      {/* End-cap dots on outermost arc */}
      <circle cx="59" cy="9"  r="1.6" fill={color}      opacity="0.40" />
      <circle cx="9"  cy="59" r="1.6" fill={colorLight} opacity="0.40" />
    </svg>
  );
}

export default function GuestCard({ guest }) {
  const [imgError, setImgError] = useState(false);
  if (!guest) return null;

  const category = colorSchemes[guest.category] || colorSchemes.spiritual;
  const imgSrc = imgError || !guest.imageUrl ? getAvatar(guest.name, guest.category) : guest.imageUrl;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`${category.bgColor} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/70 h-full relative`}
    >
      {/* SVG Corner Decorations */}
      <CornerSVG color={category.svgColor} colorLight={category.svgColorLight} flip={false} />
      <CornerSVG color={category.svgColor} colorLight={category.svgColorLight} flip={true} />

      <div className="p-3 sm:p-4">
        {/* Mobile layout */}
        <div className="flex flex-col items-center text-center sm:hidden">
          <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${category.gradient} p-0.5 mb-2`}>
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
          {guest.isExpected && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 mb-3">
              Expected Guest
            </span>
          )}
          <div className="flex-1 w-full">
            <h3 className={`font-bold text-base leading-tight mb-2 ${category.textColor}`}>{guest.name}</h3>
            <p className={`text-sm font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent mb-3`}>
              {guest.title}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">{guest.description}</p>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-start gap-5 pt-2">
          <div className="flex flex-col items-center gap-0">
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
            {guest.isExpected && (
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 whitespace-nowrap">
                Expected Guest
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 pt-6">
            <h3 className={`font-bold text-lg leading-tight mb-2 ${category.textColor}`}>{guest.name}</h3>
            <p className={`text-base font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent mb-3`}>
              {guest.title}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{guest.description}</p>
          </div>
        </div>

        {guest.significance && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
              <span className="font-semibold text-amber-600">Significance: </span>
              {guest.significance}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}