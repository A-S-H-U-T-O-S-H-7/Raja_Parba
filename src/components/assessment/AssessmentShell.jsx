"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Home, Mail, Phone, ShieldCheck, Timer, User } from "lucide-react";
import { Cinzel, Playfair_Display } from "next/font/google";

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

export default function AssessmentShell({ title, subtitle, children }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 via-white to-teal-100">
      <header className="sticky top-0 z-50 w-full">
        <div className="relative">
          <div className="absolute left-0 top-0 z-20 h-16 w-16 overflow-visible sm:h-20 sm:w-20 md:-top-1 md:h-36 md:w-36">
            <Image src="/headercorner.png" alt="corner design" fill className="object-contain" />
          </div>
          <div className="absolute right-0 top-0 z-20 h-16 w-16 sm:h-20 sm:w-20 md:-top-1 md:h-36 md:w-36">
            <Image src="/headercorner.png" alt="corner design" fill className="scale-x-[-1] object-contain" />
          </div>
          <div className="h-6 w-full bg-[url('/samborder.png')] bg-repeat-x bg-[size:auto_24px]" />
          
          <div className="border-b border-amber-200 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 shadow-lg">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8">
              <div className="flex min-h-[78px] flex-wrap items-center justify-between gap-2 py-2 md:h-20 md:flex-nowrap md:py-0">
                <div className="group relative flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="relative mb-[-6px] flex-shrink-0 md:mb-[-10px]">
                    <div className="relative h-12 w-12 rounded-full border border-rose-300 bg-gradient-to-br from-rose-400 to-red-500 p-0.5 shadow-md transition-all duration-300 group-hover:scale-105 sm:h-14 sm:w-14 md:h-24 md:w-24">
                      <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                        <Image src="/raja-logo.png" alt="Raja Mahotsav Logo" fill className="rounded-full object-contain p-1" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 right-1.5 h-2 w-2 animate-pulse rounded-full bg-amber-400 md:right-2 md:h-3 md:w-3" />
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className={`${cinzel.className} truncate bg-gradient-to-r from-rose-700 via-red-600 to-amber-700 bg-clip-text text-sm font-bold text-transparent sm:text-base md:text-3xl`}>
                        Raja Parba
                      </span>
                      <Heart className="h-3.5 w-3.5 animate-pulse fill-rose-500 text-rose-500 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>
                    <span className={`${playfair.className} text-sm font-semibold text-amber-600 sm:text-base md:text-2xl`}>
                      2026
                    </span>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-1.5 sm:gap-2 md:w-auto">
                  <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white/80 px-2 py-1 text-[11px] font-semibold text-amber-700 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Home</span>
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white/80 px-2 py-1 text-[11px] font-semibold text-amber-700 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Profile</span>
                  </button>
                  <button
                    onClick={handleBack}
                    className="group relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-600 sm:gap-2 sm:px-3 sm:py-1.5 md:px-5 md:py-3"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[11px] font-semibold sm:text-xs md:text-base">Back</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </div>
      </header>

      <section className="relative overflow-hidden border-y border-emerald-200 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 px-4 py-4 text-white shadow-sm">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-semibold md:text-base">
            Welcome to your live assessment workspace. Complete each step in order for fair evaluation.
          </p>
        </div>
      </section>

      <main className="px-3 py-6 md:px-4 md:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 rounded-3xl border border-emerald-200 bg-white/90 p-4 shadow-md md:p-5">
            <h1 className={`${cinzel.className} text-center text-2xl font-semibold text-teal-700 md:text-3xl`}>
              {title}
            </h1>
            <p className={`${playfair.className} mt-1 text-center text-sm text-teal-800`}>{subtitle}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Fair Assessment Mode
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                <Timer className="h-3.5 w-3.5" />
                Quiz: 5 Minutes
              </span>
            </div>
          </div>
          {children}
        </div>
      </main>

      <footer className="mt-4 border-t border-slate-700 bg-gradient-to-r from-slate-900 to-blue-900 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-semibold text-gray-50">Need help? Contact support</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-100">
            <span className="inline-flex items-center gap-1 text-gray-100">
              <Phone className="h-3.5 w-3.5" />
              0120-4348458
            </span>
            <a href="https://wa.me/919999014298" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-50 underline">
              <Image src="/whatsapp.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
              WhatsApp: +91 99990 14298
            </a>
            <span className="inline-flex items-center gap-1 text-gray-100">
              <Mail className="h-3.5 w-3.5" />
              info@svsamiti.com
            </span>
            <span className="inline-flex items-center gap-1 text-gray-100">
              <Phone className="h-3.5 w-3.5" />
              +91 730 339 7090
            </span>
            <a href="https://www.svsamiti.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-50 underline">
              Website: www.svsamiti.com
            </a>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/919999014298"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600"
        aria-label="Chat on WhatsApp"
      >
        <Image src="/whatsapp.png" alt="WhatsApp" width={24} height={24} className="h-6 w-6 object-contain" />
      </a>
    </div>
  );
}
