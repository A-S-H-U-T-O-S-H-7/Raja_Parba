// components/admin/seats/StallHeader.jsx
"use client";
import { Store, Check, Users, Lock } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import { STALL_STATUS } from './StallManagement';

export default function StallHeader({ allStalls, statusCounts, stallSettings }) {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100'
    }`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${
            isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
          }`}>
            <Store className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Stall Management
            </h1>
            <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage stall availability, blocking, and view bookings
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Store}
            label="Total Stalls"
            value={allStalls.length}
            color="indigo"
          />
          <StatCard
            icon={Check}
            label="Available"
            value={statusCounts[STALL_STATUS.AVAILABLE]}
            color="green"
          />
          <StatCard
            icon={Users}
            label="Booked"
            value={statusCounts[STALL_STATUS.BOOKED]}
            color="blue"
          />
          <StatCard
            icon={Lock}
            label="Blocked"
            value={statusCounts[STALL_STATUS.BLOCKED]}
            color="red"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const { isDarkMode } = useThemeStore();
  
  const colorClasses = {
    indigo: isDarkMode ? 'from-indigo-900/20 to-indigo-800/20 border-indigo-800' : 'from-indigo-50 to-indigo-100/50 border-indigo-200',
    green: isDarkMode ? 'from-green-900/20 to-green-800/20 border-green-800' : 'from-green-50 to-green-100/50 border-green-200',
    blue: isDarkMode ? 'from-blue-900/20 to-blue-800/20 border-blue-800' : 'from-blue-50 to-blue-100/50 border-blue-200',
    red: isDarkMode ? 'from-red-900/20 to-red-800/20 border-red-800' : 'from-red-50 to-red-100/50 border-red-200',
  };

  const textColors = {
    indigo: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    green: isDarkMode ? 'text-green-400' : 'text-green-600',
    blue: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    red: isDarkMode ? 'text-red-400' : 'text-red-600',
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-2xl font-bold mt-1 ${textColors[color]}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 opacity-50 ${textColors[color]}`} />
      </div>
    </div>
  );
}