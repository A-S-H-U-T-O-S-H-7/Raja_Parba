"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/lib/stores/useAuthStore";
import { ChevronDown, User, LogOut, Ticket, X, Menu } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when modal or sidebar is open
  useEffect(() => {
    if (showLogoutModal || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal, isMobileMenuOpen]);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setShowLogoutModal(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleGetTickets = () => {
    if (!user) {
      router.push('/register?redirect=tickets');
    } else {
      router.push('/tickets');
    }
  };

  return (
    <>
      <header className="w-full relative sticky top-0 z-50">

        {/* Corner Design */}
        <div className="absolute overflow-visible top-0 left-0 md:top-[-5px] md:left-0 w-24 h-24 md:w-42 md:h-42 z-20">
          <Image src="/headercorner.png" alt="corner design" fill className="object-contain" />
        </div>
        <div className="absolute top-0 right-[-10px] md:top-[-5px] md:right-0 w-24 h-24 md:w-42 md:h-42 z-20">
          <Image src="/headercorner.png" alt="corner design" fill className="object-contain scale-x-[-1]" />
        </div>

        {/* Decorative Top Border */}
        <div className="bg-[url('/samborder.png')] bg-repeat-x w-full h-6 bg-[size:auto_24px]" />
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 h-7 w-full shadow-inner"></div>

        {/* Main Navbar */}
        <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 shadow-lg border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-18">

              {/* Left: Raja Logo + Divider + Parent Org Logo */}
              <div className="flex items-center gap-3">
                {/* Raja Mahotsav Logo */}
                <div className="flex-shrink-0 relative group">
                  <div className="w-20 h-20 md:w-24 md:h-24 relative bg-gradient-to-br from-rose-400 to-red-500 rounded-full p-0.5 border border-rose-300 shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
                      <Image
                        src="/raja-logo.png"
                        alt="Raja Mahotsav Logo"
                        fill
                        className="object-contain rounded-full p-1"
                      />
                    </div>
                  </div>
                  <div className="absolute -inset-2 bg-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Divider — only on desktop */}
                <div className="hidden lg:flex flex-col items-center self-stretch py-3">
                  <div className="w-px flex-1 bg-gradient-to-b from-transparent via-amber-300 to-transparent"></div>
                </div>

                {/* Parent Org Logo — desktop only */}
                <a
                  href="https://svsamiti.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center gap-2 group pl-1"
                  title="Visit Samudayik Vikas Samiti"
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-200 shadow-sm group-hover:shadow-md group-hover:border-amber-400 transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="Samudayik Vikas Samiti"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-bold text-amber-800 group-hover:text-amber-900 transition-colors whitespace-nowrap">
                      Samudayik Vikas
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 group-hover:text-amber-900 transition-colors whitespace-nowrap">
                      Samiti
                    </span>
                    <span className="text-[10px] text-amber-500 group-hover:text-amber-600 transition-colors">
                      svsamiti.com
                    </span>
                  </div>
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-3 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full shadow-inner">
                <Link href="/" className="px-4 py-2 text-amber-900 hover:text-amber-700 font-semibold text-base xl:text-lg transition-all duration-300 hover:bg-amber-100/50 rounded-full">Home</Link>
                <Link href="/about-raja" className="px-4 py-2 text-amber-900 hover:text-amber-700 font-semibold text-base xl:text-lg transition-all duration-300 hover:bg-amber-100/50 rounded-full">About Raja</Link>
                <Link href="/events" className="px-4 py-2 text-amber-900 hover:text-amber-700 font-semibold text-base xl:text-lg transition-all duration-300 hover:bg-amber-100/50 rounded-full">Events</Link>
                <Link href="/gallery" className="px-4 py-2 text-amber-900 hover:text-amber-700 font-semibold text-base xl:text-lg transition-all duration-300 hover:bg-amber-100/50 rounded-full">Gallery</Link>
                <Link href="/guests" className="px-4 py-2 text-amber-900 hover:text-amber-700 font-semibold text-base xl:text-lg transition-all duration-300 hover:bg-amber-100/50 rounded-full">Our Guests</Link>
                <Link href="/donate" className="px-4 py-2 text-amber-900 hover:text-amber-700 font-semibold text-base xl:text-lg transition-all duration-300 hover:bg-amber-100/50 rounded-full">Donate</Link>
              </nav>

              {/* Desktop Right Section */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 px-4 py-2 rounded-full border border-amber-300 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm text-white font-bold">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-medium text-amber-800">Welcome</span>
                        <span className="text-sm font-semibold text-amber-900 truncate max-w-[150px]">{user.email}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-amber-700 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-200 py-3 z-50">
                        <div className="px-4 py-2 border-b border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-sm text-white font-bold">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-amber-900 truncate">{user.email}</p>
                              <p className="text-xs text-amber-600">Account Menu</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-800 transition-all duration-200 group">
                            <div className="w-8 h-8 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center"><User className="w-4 h-4 text-amber-600" /></div>
                            <div className="flex-1"><p className="text-sm font-medium">My Profile</p><p className="text-xs text-gray-500">View and edit profile</p></div>
                          </Link>
                          <Link href="/tickets" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group">
                            <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center"><Ticket className="w-4 h-4 text-green-600" /></div>
                            <div className="flex-1"><p className="text-sm font-medium">Get Free Entry Pass</p><p className="text-xs text-gray-500">Purchase event pass</p></div>
                          </Link>
                          <div className="border-t border-amber-100 my-2"></div>
                          <button onClick={handleLogoutClick} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700 transition-all duration-200 group w-full text-left">
                            <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center"><LogOut className="w-4 h-4 text-red-600" /></div>
                            <div className="flex-1"><p className="text-sm font-medium">Sign Out</p><p className="text-xs text-gray-500">Logout from account</p></div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/register" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Register</Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />

          <div ref={sidebarRef} className={`absolute top-0 left-0 h-full w-80 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 shadow-2xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            
            {/* Sidebar Header */}
            <div className="relative h-32 bg-gradient-to-r from-amber-600 to-orange-600 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-xl text-white font-bold">🎪</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Raja Mahotsav</p>
                    <p className="text-amber-100 text-sm">Festival Menu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-6">
              <div className="space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-100/80 font-semibold text-lg rounded-xl transition-all duration-200 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-8 h-8 bg-amber-200 group-hover:bg-amber-300 rounded-lg flex items-center justify-center text-amber-700">🏠</span>Home
                </Link>
                <Link href="/about-raja" className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-100/80 font-semibold text-lg rounded-xl transition-all duration-200 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-8 h-8 bg-amber-200 group-hover:bg-amber-300 rounded-lg flex items-center justify-center text-amber-700">📖</span>About Raja
                </Link>
                <Link href="/events" className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-100/80 font-semibold text-lg rounded-xl transition-all duration-200 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-8 h-8 bg-amber-200 group-hover:bg-amber-300 rounded-lg flex items-center justify-center text-amber-700">🎉</span>Events
                </Link>
                <Link href="/gallery" className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-100/80 font-semibold text-lg rounded-xl transition-all duration-200 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-8 h-8 bg-amber-200 group-hover:bg-amber-300 rounded-lg flex items-center justify-center text-amber-700">🖼️</span>Gallery
                </Link>
                <Link href="/guests" className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-100/80 font-semibold text-lg rounded-xl transition-all duration-200 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-8 h-8 bg-amber-200 group-hover:bg-amber-300 rounded-lg flex items-center justify-center text-amber-700">🌟</span>Our Guests
                </Link>
                <Link href="/donate" className="flex items-center gap-3 px-4 py-3 text-amber-900 hover:bg-amber-100/80 font-semibold text-lg rounded-xl transition-all duration-200 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="w-8 h-8 bg-amber-200 group-hover:bg-amber-300 rounded-lg flex items-center justify-center text-amber-700">🌟</span>Donate
                </Link>
              </div>

              <div className="my-6 border-t border-amber-200"></div>

              {/* Mobile CTA Buttons */}
              <div className="space-y-3 px-4">
                {user ? (
                  <>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="w-5 h-5" />My Profile
                    </Link>
                    <Link href="/tickets" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                      <Ticket className="w-5 h-5" />Get Free Entry Pass
                    </Link>
                    <button onClick={() => { setIsMobileMenuOpen(false); handleLogoutClick(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <LogOut className="w-5 h-5" />Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/register" className="block px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-center rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                    <button onClick={() => { setIsMobileMenuOpen(false); handleGetTickets(); }} className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-center rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">Get Free Entry Pass</button>
                  </>
                )}
              </div>
            </nav>

            {/* Sidebar Footer — with parent org logo */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-amber-200 bg-amber-50/50">
              {/* Parent org branding */}
              <a
                href="https://svsamiti.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 hover:bg-amber-100/60 transition-colors group"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-200 shadow-sm group-hover:shadow-md flex-shrink-0">
                  <Image src="/logo.png" alt="Samudayik Vikas Samiti" fill className="object-contain" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-amber-800">Samudayik Vikas Samiti</span>
                  <span className="text-[10px] text-amber-500">svsamiti.com ↗</span>
                </div>
              </a>
              <div className="px-6 pb-4 text-center">
                <p className="text-sm text-amber-700">© 2024 Raja Mahotsav</p>
                <p className="text-xs text-amber-600 mt-0.5">Celebrate the spirit of Raja</p>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancelLogout} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
            <button onClick={handleCancelLogout} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoggingOut}>
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-center text-2xl font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-center text-gray-600 mb-6">Are you sure you want to sign out? You'll need to login again to access your account.</p>
              {user?.email && (
                <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={handleCancelLogout} disabled={isLoggingOut} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                <button onClick={handleConfirmLogout} disabled={isLoggingOut} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing out...</span>
                    </>
                  ) : 'Yes, Sign Out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.2s ease-out; }
      `}</style>
    </>
  );
}