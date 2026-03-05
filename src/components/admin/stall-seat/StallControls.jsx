// components/admin/seats/StallControls.jsx
"use client";
import { 
  Filter, 
  Eye, 
  Grid3x3, 
  List, 
  CheckSquare, 
  X, 
  Lock, 
  LockOpen, 
  Loader2,
  Search
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function StallControls({
  viewMode,
  setViewMode,
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  selectedStalls,
  filteredStalls,
  allStalls,
  statusCounts,
  STALL_STATUS,
  onSelectAll,
  onClearSelection,
  onBulkAction,
  isUpdating
}) {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`space-y-4`}>
      {/* Main Controls */}
      <div className={`rounded-xl border p-5 ${
        isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Stalls
              </div>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name or number..."
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* View Mode */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Mode
              </div>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Filter Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Status
              </div>
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Stalls ({allStalls.length})</option>
              <option value={STALL_STATUS.AVAILABLE}>Available ({statusCounts[STALL_STATUS.AVAILABLE]})</option>
              <option value={STALL_STATUS.BOOKED}>Booked ({statusCounts[STALL_STATUS.BOOKED]})</option>
              <option value={STALL_STATUS.BLOCKED}>Blocked ({statusCounts[STALL_STATUS.BLOCKED]})</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex items-end gap-2">
            <button
              onClick={onSelectAll}
              disabled={filteredStalls.length === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${filteredStalls.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CheckSquare className="w-4 h-4" />
              Select All
            </button>
            <button
              onClick={onClearSelection}
              disabled={selectedStalls.length === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${selectedStalls.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedStalls.length > 0 && (
        <div className={`rounded-xl border p-4 ${
          isDarkMode 
            ? 'bg-indigo-900/10 border-indigo-800' 
            : 'bg-indigo-50 border-indigo-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-indigo-800/30' : 'bg-indigo-100'
              }`}>
                <CheckSquare className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <div>
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedStalls.length} stall{selectedStalls.length > 1 ? 's' : ''} selected
                </span>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filteredStalls.length} stalls match current filter
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => onBulkAction('block')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Block Stalls
              </button>
              <button
                onClick={() => onBulkAction('unblock')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LockOpen className="w-4 h-4" />
                )}
                Unblock Stalls
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}