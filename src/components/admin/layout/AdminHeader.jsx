// components/admin/layout/AdminHeader.jsx
"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Sun, Moon, Calendar } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import { format } from 'date-fns';

export default function AdminHeader() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { admin } = useAdminAuthStore();

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
    <header className={`sticky top-0 z-30 shadow-sm border-b ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Date */}
            <div className={`hidden sm:flex items-center space-x-2 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Back to site */}
            <Link
              href="/"
              className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}