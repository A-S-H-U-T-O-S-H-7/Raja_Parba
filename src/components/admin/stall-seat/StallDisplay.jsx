// components/admin/seats/StallDisplay.jsx
"use client";
import { Store, Check, Lock, Users, Calendar, Clock, DollarSign } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function StallDisplay({
  viewMode,
  filteredStalls,
  selectedStalls,
  getStallStatus,
  getStallInfo,
  onToggleSelection,
  STALL_STATUS,
  GRID_COLUMNS
}) {
  const { isDarkMode } = useThemeStore();

  // Get stall color based on status and selection
  const getStallColor = (stallId) => {
    const status = getStallStatus(stallId);
    const isSelected = selectedStalls.includes(stallId);
    
    if (isSelected) {
      return isDarkMode
        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-900 scale-105 z-10'
        : 'bg-indigo-500 text-white ring-2 ring-indigo-300 ring-offset-2 ring-offset-white scale-105 z-10';
    }
    
    switch(status) {
      case STALL_STATUS.BOOKED:
        return isDarkMode
          ? 'bg-gray-700 text-gray-300 border border-gray-600 opacity-80 cursor-not-allowed'
          : 'bg-gray-400 text-white border border-gray-300 opacity-80 cursor-not-allowed';
      
      case STALL_STATUS.BLOCKED:
        return isDarkMode
          ? 'bg-red-900/80 text-red-200 border border-red-800 cursor-not-allowed'
          : 'bg-red-500 text-white border border-red-400 cursor-not-allowed';
      
      default:
        return isDarkMode
          ? 'bg-emerald-700 text-emerald-100 hover:bg-emerald-600 border border-emerald-600 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'
          : 'bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-400 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200';
    }
  };

  // Render grid view
  const renderGridView = () => (
    <div className={`rounded-xl border p-5 ${
      isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
    }`}>
      {/* Row labels */}
      <div className="flex mb-3">
        <div className="w-16 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-14 gap-1.5">
          {Array.from({ length: GRID_COLUMNS }, (_, i) => (
            <div key={i} className={`text-center text-xs font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Stalls grid */}
      <div className="space-y-2">
        {Array.from({ length: Math.ceil(filteredStalls.length / GRID_COLUMNS) }, (_, rowIndex) => {
          const rowStalls = filteredStalls.slice(rowIndex * GRID_COLUMNS, (rowIndex + 1) * GRID_COLUMNS);
          
          return (
            <div key={rowIndex} className="flex items-center gap-4">
              <div className={`w-16 text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Row {rowIndex + 1}
              </div>
              <div className="flex-1 grid grid-cols-14 gap-1.5">
                {rowStalls.map(stall => {
                  const status = getStallStatus(stall.id);
                  const info = getStallInfo(stall.id);
                  
                  return (
                    <button
                      key={stall.id}
                      onClick={() => onToggleSelection(stall.id)}
                      disabled={status === STALL_STATUS.BOOKED}
                      className={`
                        relative group w-full aspect-square rounded-lg font-medium text-xs
                        flex flex-col items-center justify-center
                        ${getStallColor(stall.id)}
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
                      `}
                      title={`${stall.id} - ${status}${info?.customerName ? `\nBooked by: ${info.customerName}` : ''}`}
                    >
                      <Store className="w-3 h-3 mb-0.5" />
                      <span>{stall.number}</span>
                      
                      {/* Status indicator */}
                      {status === STALL_STATUS.BLOCKED && (
                        <div className="absolute -top-1 -right-1">
                          <Lock className="w-2.5 h-2.5 text-red-300" />
                        </div>
                      )}
                      
                      {selectedStalls.includes(stall.id) && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[8px] shadow-lg">
                          <Check className="w-2 h-2" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className={`rounded-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <span>Select</span>
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Stall ID</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Position</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Status</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Customer Info</th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Booking Details</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredStalls.map(stall => {
              const status = getStallStatus(stall.id);
              const info = getStallInfo(stall.id);
              const isSelected = selectedStalls.includes(stall.id);
              
              return (
                <tr 
                  key={stall.id} 
                  className={`transition-all duration-200 ${
                    isSelected 
                      ? isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
                      : isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelection(stall.id)}
                      disabled={status === STALL_STATUS.BOOKED}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-indigo-500" />
                      {stall.id}
                    </div>
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Row {stall.row}, Col {stall.column}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                      status === STALL_STATUS.AVAILABLE
                        ? isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-700 border border-green-300'
                        : status === STALL_STATUS.BOOKED
                        ? isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-300'
                        : isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {info?.customerName ? (
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {info.customerName}
                        </div>
                        {info.customerPhone && (
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            📞 {info.customerPhone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {info?.bookingId ? (
                      <div>
                        <div className="font-mono text-xs">{info.bookingId}</div>
                        {info.bookedByAdmin && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs mt-1 ${
                            isDarkMode ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-800' : 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          }`}>
                            Admin Booking
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return viewMode === 'grid' ? renderGridView() : renderListView();
}