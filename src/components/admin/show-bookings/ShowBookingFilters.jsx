// components/admin/show-bookings/ShowBookingFilters.jsx
"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function ShowBookingFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  participationFilter,
  onParticipationChange,
  dateFilter,
  onDateChange,
  selectedDate,
  onSelectedDateChange,
  bookingDate,
  onBookingDateChange,
  loading
}) {
  const { isDarkMode } = useThemeStore();
  const [localSearch, setLocalSearch] = useState(searchTerm || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const handleDateChange = (value) => {
    onSelectedDateChange(value ? new Date(value) : null);
  };

  const handleBookingDateChange = (value) => {
    onBookingDateChange(value ? new Date(value) : null);
  };

  const clearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className={`rounded-xl p-4 border shadow-sm ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by ID, customer name, email or seat..."
            className={`w-full pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {localSearch && (
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

        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
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
              value={participationFilter}
              onChange={(e) => onParticipationChange(e.target.value)}
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

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className={`appearance-none pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
              <option value="3months">Past 3 Months</option>
            </select>
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>

          {/* Show Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              title="Filter by show date"
            />
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            {selectedDate && (
              <button
                onClick={() => handleDateChange('')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Booking Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={formatDateForInput(bookingDate)}
              onChange={(e) => handleBookingDateChange(e.target.value)}
              className={`pl-9 pr-8 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              title="Filter by booking date"
            />
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            {bookingDate && (
              <button
                onClick={() => handleBookingDateChange('')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Info */}
      {(selectedDate || bookingDate) && (
        <div className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {selectedDate && (
            <span className="mr-4">
              Show date: <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
            </span>
          )}
          {bookingDate && (
            <span>
              Booking date: <span className="font-medium">{bookingDate.toLocaleDateString()}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}