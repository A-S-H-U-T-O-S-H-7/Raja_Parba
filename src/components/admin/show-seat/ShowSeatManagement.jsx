// app/admin/seats/shows/page.jsx
"use client";
import { useEffect } from 'react';
import { Calendar, LayoutGrid, List, Filter, Lock, Unlock, X, Eye } from 'lucide-react';
import useShowSeatManagementStore from '@/lib/stores/useShowSeatManagementStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import { format } from 'date-fns';
import ShowSeatGridView from './ShowSeatGridView';
import ShowSeatListView from './ShowSeatListView';
import UserDetailsModal from './UserDetailsModal';

export default function ShowSeatsPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { 
    seats,
    showSettings,
    loading,
    dateLoading,
    selectedDate,
    viewMode,
    filterStatus,
    selectedSeats,
    isUpdating,
    showUserDetails,
    setSelectedDate,
    setViewMode,
    setFilterStatus,
    handleStatusChange,
    clearSelection,
    selectAllFiltered,
    closeUserDetails,
    getFilteredSeats,
    getStatusCounts,
    initialize,
    cleanup
  } = useShowSeatManagementStore();

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);

  const filteredSeats = getFilteredSeats();
  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto px-2 md:px-4 py-3 md:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Show Seat Management
          </h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage seat availability and blocking for show events
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 rounded-xl p-4 md:p-6 border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Date Selection */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Calendar className="w-4 h-4 inline mr-2" />
            Event Date
          </label>
          <input
            type="date"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className={`block w-full p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        {/* View Mode */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Eye className="w-4 h-4 inline mr-2" />
            View Mode
          </label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className={`block w-full p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>

        {/* Filter */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Filter className="w-4 h-4 inline mr-2" />
            Filter Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`block w-full p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Seats</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className={`rounded-xl p-3 md:p-4 border ${
          isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full mr-2 md:mr-3"></div>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                Available
              </span>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-900'}`}>
              {statusCounts.available || 0}
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-3 md:p-4 border ${
          isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                Booked
              </span>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`}>
              {statusCounts.booked || 0}
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-3 md:p-4 border ${
          isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full mr-2 md:mr-3"></div>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                Blocked
              </span>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-900'}`}>
              {statusCounts.blocked || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Seats Actions */}
      {selectedSeats.length > 0 && (
        <div className={`rounded-xl p-3 md:p-4 border ${
          isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div>
              <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                Selected ({selectedSeats.length})
              </h3>
              <div className="flex flex-wrap gap-1">
                {selectedSeats.slice(0, 5).map(seatId => (
                  <span key={seatId} className={`px-2 py-1 rounded text-xs ${
                    isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-800'
                  }`}>
                    {seatId}
                  </span>
                ))}
                {selectedSeats.length > 5 && (
                  <span className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    +{selectedSeats.length - 5} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange(selectedSeats, 'blocked')}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Block Seats
              </button>
              
              <button
                onClick={() => handleStatusChange(selectedSeats, 'available')}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                Unblock Seats
              </button>
              
              <button
                onClick={clearSelection}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recently Released Seats Info */}
      <div className={`mb-4 p-3 rounded-lg border ${
        isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
            Recently Released Seats
          </span>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
          Seats with green pulsing animation were recently released from cancelled bookings and are now available for new reservations.
        </p>
      </div>

      {/* Seats Display */}
      {!selectedDate ? (
        <div className={`text-center py-8 md:py-12 rounded-xl border ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <Calendar className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-lg md:text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
            Select a Date
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose a date to view and manage seat availability
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <ShowSeatGridView 
          seats={filteredSeats}
          showSettings={showSettings}
          onSeatClick={(seat) => useShowSeatManagementStore.getState().handleSeatClick(seat)}
          getSeatColor={(seat) => useShowSeatManagementStore.getState().getSeatColor(seat)}
        />
      ) : (
        <ShowSeatListView 
          seats={filteredSeats}
          onSeatClick={(seat) => useShowSeatManagementStore.getState().handleSeatClick(seat)}
          selectedSeats={selectedSeats}
          onSelectAll={selectAllFiltered}
          getStatusColor={(status) => useShowSeatManagementStore.getState().getStatusColor(status)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Legend */}
      <div className={`rounded-xl p-3 md:p-4 border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Seat Status Legend
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-400"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>VIP Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-emerald-400"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Regular Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-blue-500"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-500"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-purple-500"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-400 animate-pulse"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recently Released</span>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={!!showUserDetails}
        onClose={closeUserDetails}
        userDetails={showUserDetails}
      />
    </div>
  );
}
