"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import useAuthStore from "@/lib/stores/useAuthStore";
import { ChevronDown, User, LogOut, Ticket, X } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogoutModal]);

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

              {/* Desktop Right Section - User Dropdown or Auth Buttons */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  // Logged In State - User Dropdown
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-3 bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 px-4 py-2 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-sm text-white font-bold">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-medium text-gray-700">Welcome</span>
                        <span className="text-sm font-semibold text-orange-700 truncate max-w-[150px]">
                          {user.email}
                        </span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-orange-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-sm text-white font-bold">
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                              <p className="text-xs text-gray-500">Account Menu</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {/* Profile Link */}
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">My Profile</p>
                              <p className="text-xs text-gray-500">View and edit profile</p>
                            </div>
                          </Link>

                          {/* Get Tickets Link */}
                          <Link
                            href="/tickets"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center">
                              <Ticket className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Get Tickets</p>
                              <p className="text-xs text-gray-500">Purchase event tickets</p>
                            </div>
                          </Link>

                          <div className="border-t border-gray-100 my-2"></div>

                          {/* Logout Button */}
                          <button
                            onClick={handleLogoutClick}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700 transition-all duration-200 group w-full text-left"
                          >
                            <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Sign Out</p>
                              <p className="text-xs text-gray-500">Logout from account</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Logged Out State
                  <>
                    <Link
                      href="/register"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Register
                    </Link>
                    <button
                      onClick={handleGetTickets}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                      Get Tickets
                    </button>
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
                    href="/about-raja" 
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
                  <Link 
                    href="/guests" 
                    className="px-4 py-3 text-red-800 hover:bg-red-100 font-bold text-lg rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Our Guests
                  </Link>
                  
                  {/* Mobile CTA Buttons - Conditional based on login */}
                  <div className="flex flex-col gap-3 mt-4 px-4">
                    {user ? (
                      // Mobile Logged In State
                      <>
                        <Link
                          href="/profile"
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-center transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/tickets"
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-center transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Get Tickets
                        </Link>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogoutClick();
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
                          href="/register?redirect=tickets"
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelLogout}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
            {/* Close button */}
            <button
              onClick={handleCancelLogout}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoggingOut}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-center text-2xl font-bold text-gray-900 mb-2">
                Sign Out
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to sign out? You'll need to login again to access your account.
              </p>

              {/* User Email (if available) */}
              {user?.email && (
                <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing out...</span>
                    </>
                  ) : (
                    'Yes, Sign Out'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
}