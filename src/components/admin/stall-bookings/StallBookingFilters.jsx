// components/admin/stall-bookings/StallBookingFilters.jsx
"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function StallBookingFilters({ 
  onSearch, 
  onFilterChange, 
  loading 
}) {
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    participation: 'all',
    date: 'all'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange(`${key}Filter`, value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`rounded-xl p-4 border shadow-sm ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, vendor name, email or stall..."
            className={`w-full pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={`appearance-none pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>

          {/* Participation Filter */}
          <div className="relative">
            <select
              value={filters.participation}
              onChange={(e) => handleFilterChange('participation', e.target.value)}
              className={`appearance-none pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Participation</option>
              <option value="yes">Participated</option>
              <option value="no">Not Participated</option>
            </select>
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className={`appearance-none pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
}