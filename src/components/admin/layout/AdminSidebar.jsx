// components/admin/layout/AdminSidebar.jsx
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Ticket,
  MapPin,
  Settings,
  LogOut,
  Heart,
  Star,
  FileText,
  Shield,
  IndianRupee,
  Image,
  User,
  Sparkles,
  ScanLine,
  ClipboardCheck,
  MailWarning,
  Menu,
  X
} from 'lucide-react';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import { useState, useEffect } from 'react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: 'view_overview'
  },
  {
    name: 'Stall Booking',
    href: '/admin/bookings/stalls',
    icon: Ticket,
    permission: 'view_stall_bookings'
  },
  {
    name: 'Stall Seats',
    href: '/admin/stalls',
    icon: MapPin,
    permission: 'manage_stalls'
  },
  {
    name: 'Show Booking',
    href: '/admin/bookings/shows',
    icon: Star,
    permission: 'view_show_bookings'
  },
  {
    name: 'Show Seats',
    href: '/admin/show-seats',
    icon: MapPin,
    permission: 'manage_show_seats'
  },
  {
    name: 'Raja Activity',
    href: '/admin/raja-activities',
    icon: Sparkles,
    permission: 'view_sponsor_performer'
  },
  {
    name: 'Assessment',
    href: '/admin/assessment',
    icon: ClipboardCheck,
    permission: 'view_sponsor_performer'
  },
  {
    name: 'Assessment Quiz',
    href: '/admin/assessment-quiz',
    icon: ClipboardCheck,
    permission: 'view_sponsor_performer'
  },
  {
    name: 'Entry Pass Management',
    href: '/admin/entry-pass-management',
    icon: Ticket,
    permission: 'view_entry_pass_management'
  },
  {
    name: 'Pass Scanner',
    href: '/admin/scan',
    icon: ScanLine,
    permission: 'view_pass_scanner'
  },
  {
    name: 'Our Guests',
    href: '/admin/distinguished-guests',
    icon: User,
    permission: 'view_guests'
  },
  {
    name: 'Manage Gallery',
    href: '/admin/gallery',
    icon: Image,
    permission: 'manage_gallery'
  },
  {
    name: 'Donation',
    href: '/admin/donations',
    icon: Heart,
    permission: 'view_donations'
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    permission: 'view_users'
  },
  {
    name: 'Admin Management',
    href: '/admin/admins',
    icon: Shield,
    permission: 'manage_admins'
  },
  {
    name: 'Price Setting',
    href: '/admin/price-settings',
    icon: IndianRupee,
    permission: 'manage_pricing'
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'manage_settings'
  },
  {
    name: 'Cancellation Mail',
    href: '/admin/cancellation-mails',
    icon: MailWarning,
    permission: 'manage_settings'
  },
  {
    name: 'Activity Log',
    href: '/admin/logs',
    icon: FileText,
    permission: 'view_logs'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, hasPermission, adminLogout } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    setIsMobileOpen(false);
    router.replace('/admin/login');
  };

  const filteredNav = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;
    
    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
          isActive
            ? isDarkMode
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/20'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200'
            : isDarkMode
              ? 'hover:bg-gray-800 text-gray-300 hover:text-indigo-400'
              : 'hover:bg-indigo-50 text-gray-700 hover:text-indigo-600'
        }`}
      >
        <div className={`text-xl flex-shrink-0 transition-all duration-200 ${
          isActive 
            ? 'text-white' 
            : 'group-hover:scale-110 group-hover:text-indigo-500'
        }`}>
          <item.icon size={20} />
        </div>
        <span className="text-base whitespace-nowrap transition-all duration-200">
          {item.name}
        </span>
      </Link>
    );
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-3 left-4 z-[50] lg:hidden p-3 rounded-xl shadow-lg transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-800/90 hover:bg-gray-700/90 text-indigo-400 border border-gray-700'
            : 'bg-white/90 hover:bg-indigo-50/90 text-indigo-600 border border-indigo-200'
        } backdrop-blur-sm`}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isDarkMode
            ? 'bg-gray-900/95 text-white border-r border-gray-800'
            : 'bg-white/98 text-gray-900 border-r border-indigo-100'
        } backdrop-blur-md ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col overflow-hidden`}
      >
        {/* Logo Section - Updated with white background and rounded full */}
        <div className={`flex items-center justify-center px-4 py-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-indigo-100'
        }`}>
          <Link
            href="/admin/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="bg-white rounded-full p-2 shadow-md">
              <img 
                src="/raja-logo.png" 
                alt="Raja Parba Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback-logo.png';
                }}
              />
            </div>
            <div className="ml-3 overflow-hidden">
              <span className={`text-xl font-bold ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent'
              }`}>
                Raja Parba
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation - Takes full height, no user info at bottom */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <nav className="flex flex-col space-y-1.5">
            {filteredNav.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Removed user info and logout button section completely */}
      </aside>

      {/* Add custom scrollbar styles */}
<style jsx>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: ${isDarkMode ? '#4B5563' : '#94A3B8'};
    border-radius: 2px;
    border: none;  
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: ${isDarkMode ? '#6B7280' : '#64748B'};
    border: none; 
  }
`}</style>

    </>
  );
}
