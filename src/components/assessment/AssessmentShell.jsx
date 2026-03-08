"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Mail, MessageCircle, Phone, ShieldCheck, Timer } from "lucide-react";
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
          <div className="absolute left-0 top-0 z-20 h-24 w-24 overflow-visible md:-top-1 md:h-36 md:w-36">
            <Image src="/headercorner.png" alt="corner design" fill className="object-contain" />
          </div>
          <div className="absolute right-0 top-0 z-20 h-24 w-24 md:-top-1 md:h-36 md:w-36">
            <Image src="/headercorner.png" alt="corner design" fill className="scale-x-[-1] object-contain" />
          </div>
          <div className="h-6 w-full bg-[url('/samborder.png')] bg-repeat-x bg-[size:auto_24px]" />
          
          <div className="border-b border-amber-200 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 shadow-lg">
            <div className="mx-auto max-w-7xl px-8">
              <div className="flex h-16 md:h-20 items-center justify-between">
                <div className="group relative flex items-center gap-4">
                  <div className="relative mb-[-10px] flex-shrink-0">
                    <div className="relative h-16 w-16 rounded-full border border-rose-300 bg-gradient-to-br from-rose-400 to-red-500 p-0.5 shadow-md transition-all duration-300 group-hover:scale-105 md:h-24 md:w-24">
                      <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                        <Image src="/raja-logo.png" alt="Raja Mahotsav Logo" fill className="rounded-full object-contain p-1" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 right-2 h-3 w-3 animate-pulse rounded-full bg-amber-400" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className={`${cinzel.className} bg-gradient-to-r from-rose-700 via-red-600 to-amber-700 bg-clip-text text-lg md:text-2xl font-bold text-transparent md:text-3xl`}>
                        Raja Parba
                      </span>
                      <Heart className="h-5 w-5 animate-pulse fill-rose-500 text-rose-500" />
                    </div>
                    <span className={`${playfair.className} text-lg font-semibold text-amber-600 md:text-2xl`}>
                      2026
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBack}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500 to-orange-500 px-2 md:px-5 py-1 md:py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-600"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm font-semibold md:text-base">Back</span>
                </button>
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

      <footer className="mt-4 border-t border-emerald-200 bg-white/90 px-4 py-5">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-emerald-800">Need help? Contact support</p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium text-emerald-700">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              +91 98765 43210
            </span>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp: +91 98765 43210
            </a>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              support@rajaparba.com
            </span>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
