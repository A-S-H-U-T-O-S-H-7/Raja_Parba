// components/admin/system/ShowSettings.jsx
"use client";
import { 
  Calendar, 
  Clock, 
  Settings, 
  Eye, 
  EyeOff, 
  Trash2,
  Plus,
  IndianRupee,
  Ticket,
  Star,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useSystemSettingsStore from '@/lib/stores/useSystemSettingsStore';
import { useState } from 'react';
import { format } from 'date-fns';

export default function ShowSettings() {
  const { isDarkMode } = useThemeStore();
  const { 
    showSettings, 
    iconOptions,
    newShow,
    editingShow,
    updateShowEventDates,
    toggleShowEventDates,
    updateShowAvailableDays,
    updatePremiumBlock,
    togglePremiumBlockActive,
    updateRegularBlock,
    toggleRegularBlockActive,
    updateNewShow,
    addShowTiming,
    removeShowTiming,
    toggleShowActive,
    setEditingShow
  } = useSystemSettingsStore();

  const [showAllShows, setShowAllShows] = useState(false);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate totals
  const totalPremiumSeats = showSettings.seatLayout.premiumBlocks
    .filter(b => b.isActive)
    .reduce((sum, b) => sum + (b.maxRows * b.maxPairsPerRow * 2), 0);
  
  const totalRegularSeats = showSettings.seatLayout.regularBlocks
    .filter(b => b.isActive)
    .reduce((sum, b) => sum + (b.maxRows * b.maxSeatsPerRow), 0);
  
  const totalSeats = totalPremiumSeats + totalRegularSeats;

  return (
    <div className="space-y-8 p-6">
      {/* Show Date Configuration */}
      <div className={`rounded-lg border p-6 ${
        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Calendar className="w-5 h-5 mr-2" />
          Show Date Configuration
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <input
              id="showDatesActive"
              type="checkbox"
              checked={showSettings.eventDates.isActive}
              onChange={(e) => toggleShowEventDates(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="showDatesActive" className={`ml-2 block text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Enable custom show date range
            </label>
          </div>

          {showSettings.eventDates.isActive && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={showSettings.eventDates.startDate}
                  onChange={(e) => updateShowEventDates('startDate', e.target.value)}
                  className={`block w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  End Date
                </label>
                <input
                  type="date"
                  value={showSettings.eventDates.endDate}
                  onChange={(e) => updateShowEventDates('endDate', e.target.value)}
                  className={`block w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Available Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={showSettings.eventDates.availableDays}
                  onChange={(e) => updateShowAvailableDays(parseInt(e.target.value) || 5)}
                  className={`block w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode 
                      ? 'bg-gray-600 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          )}

          <div className={`p-3 rounded-md ${
            isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              {showSettings.eventDates.isActive && showSettings.eventDates.startDate && showSettings.eventDates.endDate
                ? `Show dates will be available from ${showSettings.eventDates.startDate} to ${showSettings.eventDates.endDate}`
                : `When disabled, the default ${showSettings.eventDates.availableDays}-day range from today will be used`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Show Seat Layout */}
      <div className={`rounded-lg border p-6 ${
        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Settings className="w-5 h-5 mr-2" />
          Show Seat Layout
        </h3>

        {/* Premium Blocks */}
        <div className={`mb-6 p-4 rounded-md ${
          isDarkMode ? 'bg-gray-600' : 'bg-white'
        }`}>
          <h4 className={`text-sm font-medium mb-3 flex items-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Premium Blocks (VIP Seating)
          </h4>
          
          <div className="space-y-3">
            {showSettings.seatLayout.premiumBlocks.map((block, index) => (
              <div key={block.id} className={`flex items-start space-x-4 p-4 rounded-md border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              } ${!block.isActive ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => togglePremiumBlockActive(index)}
                  className={`p-1 rounded mt-1 ${
                    block.isActive 
                      ? 'text-green-600 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                  title={block.isActive ? 'Disable block' : 'Enable block'}
                >
                  {block.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <div className="flex-1">
                  <div className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {block.name} ({block.id})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Max Rows
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={block.maxRows}
                        onChange={(e) => updatePremiumBlock(index, 'maxRows', parseInt(e.target.value) || 1)}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Pairs Per Row
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={block.maxPairsPerRow}
                        onChange={(e) => updatePremiumBlock(index, 'maxPairsPerRow', parseInt(e.target.value) || 1)}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={block.price}
                        onChange={(e) => updatePremiumBlock(index, 'price', parseInt(e.target.value) || 0)}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Total Seats
                      </label>
                      <div className={`px-2 py-1 text-sm rounded border ${
                        isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {block.maxRows * block.maxPairsPerRow * 2}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regular Blocks */}
        <div className={`mb-6 p-4 rounded-md ${
          isDarkMode ? 'bg-gray-600' : 'bg-white'
        }`}>
          <h4 className={`text-sm font-medium mb-3 flex items-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Regular Blocks (Standard Seating)
          </h4>
          
          <div className="space-y-3">
            {showSettings.seatLayout.regularBlocks.map((block, index) => (
              <div key={block.id} className={`flex items-start space-x-4 p-4 rounded-md border ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              } ${!block.isActive ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => toggleRegularBlockActive(index)}
                  className={`p-1 rounded mt-1 ${
                    block.isActive 
                      ? 'text-green-600 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                  title={block.isActive ? 'Disable block' : 'Enable block'}
                >
                  {block.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <div className="flex-1">
                  <div className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {block.name} ({block.id})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Max Rows
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={block.maxRows}
                        onChange={(e) => updateRegularBlock(index, 'maxRows', parseInt(e.target.value) || 1)}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Seats Per Row
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={block.maxSeatsPerRow}
                        onChange={(e) => updateRegularBlock(index, 'maxSeatsPerRow', parseInt(e.target.value) || 1)}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={block.price}
                        onChange={(e) => updateRegularBlock(index, 'price', parseInt(e.target.value) || 0)}
                        className={`w-full px-2 py-1 text-sm rounded border ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Total Seats
                      </label>
                      <div className={`px-2 py-1 text-sm rounded border ${
                        isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {block.maxRows * block.maxSeatsPerRow}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layout Summary */}
        <div className={`p-4 rounded-md border ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            🎭 Show Layout Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                isDarkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                {showSettings.seatLayout.premiumBlocks.filter(b => b.isActive).length}
              </div>
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-amber-300' : 'text-amber-700'
              }`}>Premium Blocks</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {showSettings.seatLayout.regularBlocks.filter(b => b.isActive).length}
              </div>
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}>Regular Blocks</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {totalPremiumSeats}
              </div>
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>Premium Seats</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              isDarkMode ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200'
            }`}>
              <div className={`text-3xl font-bold mb-1 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {totalRegularSeats}
              </div>
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>Regular Seats</div>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded-md ${
            isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-blue-300' : 'text-blue-800'
            }`}>
              🎫 Total Show Capacity: {totalSeats} seats
            </p>
          </div>
        </div>
      </div>

      {/* Show Timing Management */}
      <div className={`rounded-lg border p-6 ${
        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Clock className="w-5 h-5 mr-2" />
          Show Timing Management
        </h3>

        {/* Existing Show Timings */}
        <button
          onClick={() => setShowAllShows(!showAllShows)}
          className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-600 rounded-md mb-3"
        >
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Current Show Timings ({showSettings.shows.length})
          </h4>
          {showAllShows ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAllShows && (
          <div className="space-y-3 mb-6">
            {showSettings.shows.map((show, index) => (
              <div key={show.id || index} className={`flex items-center space-x-3 p-4 rounded-md border ${
                isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'
              } ${!show.isActive ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => toggleShowActive(index)}
                  className={`p-1 rounded ${
                    show.isActive 
                      ? 'text-green-600 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                  title={show.isActive ? 'Disable show' : 'Enable show'}
                >
                  {show.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <div className="text-2xl">{show.icon}</div>
                
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {show.name}
                    {show.badgeText && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                        {show.badgeText}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {formatTime(show.timeFrom)} - {formatTime(show.timeTo)}
                  </div>
                  {show.description && (
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {show.description}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => removeShowTiming(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Remove show timing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {showSettings.shows.length === 0 && (
              <div className={`text-center py-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No show timings configured. Add one below.
              </div>
            )}
          </div>
        )}

        {/* Add New Show Timing */}
        <div className={`border-t pt-4 ${
          isDarkMode ? 'border-gray-600' : 'border-gray-300'
        }`}>
          <h4 className={`text-sm font-medium mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Add New Show Timing
          </h4>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Show ID (e.g., morning_show)"
                value={newShow.id}
                onChange={(e) => updateNewShow('id', e.target.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <input
                type="text"
                placeholder="Show Name"
                value={newShow.name}
                onChange={(e) => updateNewShow('name', e.target.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="time"
                value={newShow.timeFrom}
                onChange={(e) => updateNewShow('timeFrom', e.target.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="time"
                value={newShow.timeTo}
                onChange={(e) => updateNewShow('timeTo', e.target.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <select
                value={newShow.icon}
                onChange={(e) => updateNewShow('icon', e.target.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Badge Text (Optional)"
                value={newShow.badgeText}
                onChange={(e) => updateNewShow('badgeText', e.target.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <input
              type="text"
              placeholder="Description"
              value={newShow.description}
              onChange={(e) => updateNewShow('description', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-md border ${
                isDarkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <button
              onClick={addShowTiming}
              className="w-full inline-flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Show Timing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}