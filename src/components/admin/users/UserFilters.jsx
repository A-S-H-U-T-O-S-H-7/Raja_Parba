// components/admin/users/UserFilters.jsx
"use client";
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Users,
  UserCheck,
  UserX,
  Ban,
  Smartphone,
  Mail
} from 'lucide-react';
import useUserStore from '@/lib/stores/useUserStore';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function UserFilters() {
  const { filters, setFilters, resetFilters, fetchUsers } = useUserStore();
  const { isDarkMode } = useThemeStore();
  
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters]);

  const handleStatusChange = (status) => {
    setFilters({ status });
  };

  const handleRoleChange = (role) => {
    setFilters({ role });
  };

  const handleSignInMethodChange = (method) => {
    setFilters({ signInMethod: method });
  };

  const handleReset = () => {
    setLocalSearch('');
    resetFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.role !== 'all') count++;
    if (filters.signInMethod !== 'all') count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar - Always Visible */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by email or name..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 transition-all ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400'
            }`}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
            showFilters
              ? 'bg-purple-600 text-white border-purple-600'
              : isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              showFilters
                ? 'bg-white text-purple-600'
                : isDarkMode
                  ? 'bg-purple-900 text-purple-300'
                  : 'bg-purple-100 text-purple-600'
            }`}>
              {getActiveFilterCount()}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className={`rounded-xl border p-5 space-y-5 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter Users
            </h3>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={handleReset}
                className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Status Filter */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Status
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Status', icon: Users },
                  { value: 'active', label: 'Active', icon: UserCheck, color: 'green' },
                  { value: 'suspended', label: 'Suspended', icon: UserX, color: 'yellow' },
                  { value: 'banned', label: 'Banned', icon: Ban, color: 'red' }
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = filters.status === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        isSelected
                          ? option.value === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : option.value === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : option.value === 'banned'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : isDarkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                          : isDarkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${
                        isSelected && option.color ? `text-${option.color}-500` : ''
                      }`} />
                      <span className="flex-1 text-left">{option.label}</span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                User Role
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Roles' },
                  { value: 'user', label: 'Regular User' },
                  { value: 'vip', label: 'VIP User' },
                  { value: 'organizer', label: 'Event Organizer' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRoleChange(option.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.role === option.value
                        ? isDarkMode
                          ? 'bg-purple-900/30 text-purple-400'
                          : 'bg-purple-100 text-purple-700'
                        : isDarkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="flex-1 text-left">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sign-in Method Filter */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Sign-in Method
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Methods', icon: Users },
                  { value: 'email', label: 'Email/Password', icon: Mail },
                  { value: 'google', label: 'Google', icon: Smartphone }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSignInMethodChange(option.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.signInMethod === option.value
                          ? isDarkMode
                            ? 'bg-purple-900/30 text-purple-400'
                            : 'bg-purple-100 text-purple-700'
                          : isDarkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className={`pt-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Filters:
                </span>
                {filters.search && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                    <Search className="w-3 h-3" />
                    "{filters.search}"
                  </span>
                )}
                {filters.status !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    filters.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : filters.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : filters.status === 'banned'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    Status: {filters.status}
                  </span>
                )}
                {filters.role !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    Role: {filters.role}
                  </span>
                )}
                {filters.signInMethod !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    Sign-in: {filters.signInMethod}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}