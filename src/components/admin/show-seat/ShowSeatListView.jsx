// components/admin/show-seats/ShowSeatListView.jsx
"use client";
import { Check } from 'lucide-react';

export default function ShowSeatListView({ 
  seats, 
  onSeatClick, 
  selectedSeats, 
  onSelectAll,
  getStatusColor,
  isDarkMode 
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedSeats.length === seats.length && seats.length > 0}
                  onChange={(e) => onSelectAll()}
                  className={`rounded ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                  }`}
                />
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Seat
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Row
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Section
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 md:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {seats.map(seat => (
              <tr key={seat.id} className={`${
                isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              } ${selectedSeats.includes(seat.id) ? 
                isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50' : ''}`}>
                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedSeats.includes(seat.id)}
                    onChange={() => onSeatClick(seat)}
                    disabled={seat.status === 'booked'}
                    className={`rounded ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </td>
                <td className={`px-3 md:px-4 py-3 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <div className="font-medium">{seat.displayName}</div>
                  <div className="text-xs opacity-70">{seat.id}</div>
                </td>
                <td className={`px-3 md:px-4 py-3 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  R{seat.row}
                </td>
                <td className={`px-3 md:px-4 py-3 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {seat.section}
                </td>
                <td className={`px-3 md:px-4 py-3 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {seat.type}
                </td>
                <td className={`px-3 md:px-4 py-3 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  ₹{seat.price}
                </td>
                <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seat.status)}`}>
                    {seat.status}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onSeatClick(seat)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedSeats.includes(seat.id)
                        ? isDarkMode ? 'bg-purple-800 text-purple-100' : 'bg-purple-500 text-white'
                        : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {seat.status === 'booked' ? 'View' : 
                     selectedSeats.includes(seat.id) ? 'Selected' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}