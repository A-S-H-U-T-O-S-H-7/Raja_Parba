"use client";

import Image from "next/image";
import Link from "next/link";

const DEFAULT_MESSAGE = (
  <>
    We all hold the power to{" "}
    <em className="text-rose-600 not-italic font-semibold">give 🤝</em> — even
    a small act of kindness can bring{" "}
    <em className="text-amber-700 not-italic font-semibold">
      food to the hungry 🍱
    </em>{" "}
    and{" "}
    <em className="text-rose-600 not-italic font-semibold">education</em> to
    those who need it{" "}
    <em className="text-amber-700 not-italic font-semibold">most ✨</em>
  </>
);

export default function DonationSupportCard({
  message = DEFAULT_MESSAGE,
  buttonLabel = "Donate now →",
  href = "/donation",
  badge = "A small help for a smile 🌿",
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch overflow-hidden rounded-[20px] border border-rose-300 bg-rose-50/60 shadow-sm ${className}`.trim()}
    >
      {/* Image — full width on mobile, fixed width on sm+ */}
      <div className="relative h-48 w-full sm:h-auto sm:w-44 sm:min-w-[175px] shrink-0 overflow-hidden bg-rose-100">
        <Image
          src="/donation4.png"
          alt="Support donation"
          fill
          sizes="(max-width: 640px) 100vw, 175px"
          className="object-cover saturate-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-rose-900/15 to-transparent" />
        {badge && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-rose-900/75 px-3 py-1.5 text-center font-serif text-[10px] italic text-white backdrop-blur-sm">
            {badge}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-2.5 px-4 py-4">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-rose-600">
            Make a difference
          </p>
          <div className="mb-2 h-0.5 w-7 rounded-full bg-rose-100" />
        </div>

        <p className="flex-1 font-serif text-[14.5px] leading-relaxed text-rose-950">
          {message}
        </p>

        <Link
          href={href}
          className="self-start inline-flex items-center gap-1 rounded-full bg-rose-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-800 active:scale-95"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}