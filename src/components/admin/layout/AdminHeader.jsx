// components/admin/layout/AdminHeader.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Sun, Moon, Calendar, LogOut, ChevronDown, User } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import { format } from 'date-fns';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { admin, adminLogout } = useAdminAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
    setDropdownOpen(false);
    router.replace('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split('/').filter(Boolean);
    if (path.length === 1) return 'Dashboard';
    
    const lastSegment = path[path.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className={`fixed top-0 right-0 left-0 z-40 lg:pl-64 transition-all duration-300 ${
      isDarkMode
        ? 'bg-gray-900/95 border-b border-gray-800 backdrop-blur-md'
        : 'bg-linear-to-br from-indigo-200 via-blue-50 to-blue-100 border-b border-indigo-100 backdrop-blur-md'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Page Title - Visible on larger screens */}
          <div className="hidden lg:block">
            <h1 className={`text-xl font-bold bg-gradient-to-r ${
              isDarkMode
                ? 'from-indigo-400 to-blue-400 bg-clip-text text-transparent'
                : 'from-indigo-700 to-blue-700 bg-clip-text text-transparent'
            }`}>
              {getPageTitle()}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center justify-end w-full lg:w-auto gap-2 sm:gap-3">
            {/* Date */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isDarkMode
                ? 'bg-gray-800/80 text-gray-300 border border-gray-700'
                : 'bg-indigo-50/80 text-gray-600 border border-indigo-100'
            }`}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800/80 hover:bg-gray-700 text-indigo-400 border border-gray-700'
                    : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-600 border border-indigo-200'
                }`}
                title="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Back to site */}
              <Link
                href="/"
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700'
                    : 'bg-indigo-50/80 hover:bg-indigo-100 text-gray-700 border border-indigo-200'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </Link>
            </div>

            {/* User dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800/80 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200'
                }`}
              >
                {/* User info - Hidden on mobile */}
                <div className="text-right min-w-0 flex-shrink hidden sm:block">
                  <p className={`text-xs sm:text-sm font-semibold truncate max-w-[120px] ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {admin?.name || admin?.username || 'Admin'}
                  </p>
                  <p className={`text-xs truncate max-w-[120px] ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>

                {/* Avatar */}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md'
                }`}>
                  <span className="text-sm">
                    {admin?.name?.charAt(0) || admin?.username?.charAt(0) || 'A'}
                  </span>
                </div>

                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${
                  dropdownOpen ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 ${
                  isDarkMode
                    ? 'bg-gray-800/95 border-gray-700'
                    : 'bg-white/95 border-indigo-100'
                } backdrop-blur-md`}>
                  <div className="py-2">
                    {/* User info section */}
                    <div className={`px-4 py-3 border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-indigo-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                          isDarkMode
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
                            : 'bg-gradient-to-r from-indigo-600 to-blue-600'
                        }`}>
                          <span className="text-sm">
                            {admin?.name?.charAt(0) || admin?.username?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {admin?.name || admin?.username || 'Admin'}
                          </p>
                          <p className={`text-xs truncate mt-0.5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {admin?.email || `${admin?.username}@admin.com`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Logout button */}
                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 rounded-b-xl font-medium ${
                        isDarkMode
                          ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                          : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                      }`}
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}