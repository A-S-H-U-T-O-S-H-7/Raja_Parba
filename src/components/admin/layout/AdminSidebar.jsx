// components/admin/layout/AdminSidebar.jsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Receipt,
  IndianRupee,
  Image,
  User,
  Sparkles
} from 'lucide-react';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import { useState } from 'react';

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
    href: '/admin/seats/shows',
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
    name: 'Cancellation & Refund',
    href: '/admin/cancellations',
    icon: Receipt,
    permission: 'manage_cancellations'
  },
  {
    name: 'Our Guests',
    href: '/admin/guests',
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
    href: '/admin/settings/pricing',
    icon: IndianRupee,
    permission: 'manage_pricing'
  },
  {
    name: 'System Settings',
    href: '/admin/settings/system',
    icon: Settings,
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
  const { admin, hasPermission, adminLogout } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredNav = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const NavItem = ({ item, depth = 0 }) => {
    const isActive = pathname === item.href;
    
    return (
      <Link
        href={item.href}
        className={`flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? isDarkMode
              ? 'bg-purple-900/50 text-purple-300 border-r-2 border-purple-400'
              : 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
            : isDarkMode
              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {item.icon && <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-purple-500' : ''}`} />}
        <span className="flex-1">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        border-r lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`h-16 flex items-center justify-center border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Raja Mahotsav</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {filteredNav.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* User info */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {admin?.name?.charAt(0) || admin?.username?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {admin?.name || admin?.username}
              </p>
              <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={() => adminLogout()}
            className={`w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${isDarkMode 
                ? 'text-red-400 bg-red-900/20 hover:bg-red-900/40' 
                : 'text-red-600 bg-red-50 hover:bg-red-100'
              }`}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}