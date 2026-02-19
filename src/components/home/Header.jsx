"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import useAuthStore from "@/lib/stores/useAuthStore";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="w-full relative sticky top-0 z-50">

      {/* Corner Design */}
            <div className="absolute overflow-x-hidden top-0 left-0 md:top-[-5px] md:left-0 w-24 h-24 md:w-42 md:h-42 z-20">
              <Image
                src="/headercorner.png"
                alt="corner design"
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute top-0 right-[-10px] md:top-[-5px] md:right-0 w-24 h-24 md:w-42 md:h-42 z-20">
              <Image
                src="/headercorner.png"
                alt="corner design"
                fill
                className="object-contain scale-x-[-1]"
              />
            </div>

      {/* Decorative Top Border with Marigold Pattern */}
      <div className="bg-[url('/samborder.png')] bg-repeat-x w-full h-6 bg-[size:auto_24px]" />
      <div className="bg-linear-to-r from-green-800 via-green-700 to-green-800 h-7 w-full"></div>

      {/* Main Navbar */}
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 shadow-lg ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex items-center justify-between">
            
            {/* Logo Section with Decorative Border */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 bg-white border-1 border-red-800 rounded-full pl-2 pr-6 py-1 shadow-md">
                <div className="w-14 h-14 relative bg-white rounded-full p-1 border-2 border-yellow-500">
                  <Image
                    src="/logo.png"
                    alt="Raja Mahotsav Logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <div className="leading-tight">
                  <h1 className="text-xl sm:text-2xl font-bold text-red-800 tracking-tight">
                    Raja Mahotsav
                  </h1>
                  <p className="text-sm sm:text-base text-green-700 font-semibold">
                    2026
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
              <Link 
                href="/" 
                className="px-4 py-2 text-red-800 hover:text-red-600 font-bold text-base xl:text-lg transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/about-raja" 
                className="px-4 py-2 text-red-800 hover:text-red-600 font-bold text-base xl:text-lg transition-colors"
              >
                About Raja
              </Link>
              <Link 
                href="/events" 
                className="px-4 py-2 text-red-800 hover:text-red-600 font-bold text-base xl:text-lg transition-colors"
              >
                Events
              </Link>
              <Link 
                href="/gallery" 
                className="px-4 py-2 text-red-800 hover:text-red-600 font-bold text-base xl:text-lg transition-colors"
              >
                Gallery
              </Link>
              <Link 
                href="/guests" 
                className="px-4 py-2 text-red-800 hover:text-red-600 font-bold text-base xl:text-lg transition-colors"
              >
                Our Guests
              </Link>
            </nav>

            {/* Desktop Right Section - Conditional based on login */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                // Logged In State
                <>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Logged Out State
                <>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Register
                  </Link>
                  <Link
                    href="/tickets"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Get Tickets
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-red-800 hover:bg-red-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t-2 border-red-200 pt-4">
              <nav className="flex flex-col gap-2">
                <Link 
                  href="/" 
                  className="px-4 py-3 text-red-800 hover:bg-red-100 font-bold text-lg rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="px-4 py-3 text-red-800 hover:bg-red-100 font-bold text-lg rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Raja
                </Link>
                <Link 
                  href="/events" 
                  className="px-4 py-3 text-red-800 hover:bg-red-100 font-bold text-lg rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events
                </Link>
                <Link 
                  href="/gallery" 
                  className="px-4 py-3 text-red-800 hover:bg-red-100 font-bold text-lg rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                
                {/* Mobile CTA Buttons - Conditional based on login */}
                <div className="flex flex-col gap-3 mt-4 px-4">
                  {user ? (
                    // Mobile Logged In State
                    <>
                      <Link
                        href="/dashboard"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-center transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-center transition-all duration-300"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    // Mobile Logged Out State
                    <>
                      <Link
                        href="/register"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-center transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                      <Link
                        href="/tickets"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-center transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Tickets
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-red-700 h-1 w-full" />
    </header>
  );
}