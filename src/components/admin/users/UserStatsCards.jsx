// components/admin/users/UserStatsCards.jsx
"use client";
import { useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  MailCheck,
  Calendar,
  TrendingUp,
  Smartphone
} from 'lucide-react';
import useUserStore from '@/lib/stores/useUserStore';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function UserStatsCards() {
  const { stats, fetchUserStats } = useUserStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'blue',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100',
      textColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      borderColor: isDarkMode ? 'border-blue-800' : 'border-blue-200'
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'green',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-100',
      textColor: isDarkMode ? 'text-green-400' : 'text-green-600',
      borderColor: isDarkMode ? 'border-green-800' : 'border-green-200'
    },
    {
      title: 'Email Verified',
      value: stats.emailVerified,
      icon: MailCheck,
      color: 'purple',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100',
      textColor: isDarkMode ? 'text-purple-400' : 'text-purple-600',
      borderColor: isDarkMode ? 'border-purple-800' : 'border-purple-200'
    }
  ];

  const secondaryStats = [
    {
      title: 'Google Users',
      value: stats.googleUsers,
      icon: Smartphone,
      color: 'orange',
      bgColor: isDarkMode ? 'bg-orange-900/20' : 'bg-orange-100',
      textColor: isDarkMode ? 'text-orange-400' : 'text-orange-600'
    },
    {
      title: 'Email Users',
      value: stats.emailUsers,
      icon: MailCheck,
      color: 'indigo',
      bgColor: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-100',
      textColor: isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
    },
    {
      title: 'New Today',
      value: stats.todayNew,
      icon: Calendar,
      color: 'teal',
      bgColor: isDarkMode ? 'bg-teal-900/20' : 'bg-teal-100',
      textColor: isDarkMode ? 'text-teal-400' : 'text-teal-600'
    },
    {
      title: 'This Month',
      value: stats.thisMonthNew,
      icon: TrendingUp,
      color: 'cyan',
      bgColor: isDarkMode ? 'bg-cyan-900/20' : 'bg-cyan-100',
      textColor: isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-2xl border-2 p-4 transition-all hover:shadow-md ${
                isDarkMode 
                  ? `bg-gray-800 ${stat.borderColor}` 
                  : `bg-white ${stat.borderColor}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              
              {/* Mini progress bar for active ratio */}
              {stat.title === 'Active Users' && stats.total > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.active / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {Math.round((stats.active / stats.total) * 100)}% active rate
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-xl border p-3 transition-colors ${
                isDarkMode
                  ? 'bg-gray-800/60 border-gray-700'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.textColor}`} />
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
    </div>
  );
}
