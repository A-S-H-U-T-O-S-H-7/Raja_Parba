// components/admin/price/ShowPriceSection.jsx
"use client";
import { Tv } from 'lucide-react';
import usePriceStore from '@/lib/stores/usePriceStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import EarlyBirdDiscounts from './EarlyBirdDiscounts';
import BulkBookingDiscounts from './BulkBookingDiscounts';

export default function ShowPriceSection() {
  const { isDarkMode } = useThemeStore();
  const { 
    show, 
    updateShowSeatType,
    addShowEarlyBird,
    removeShowEarlyBird,
    toggleShowEarlyBird,
    addShowBulk,
    removeShowBulk,
    toggleShowBulk
  } = usePriceStore();

  const seatTypes = [
    { key: 'blockA', label: 'Block A Premium', color: 'purple' },
    { key: 'blockB', label: 'Block B Premium', color: 'blue' },
    { key: 'blockC', label: 'Block C Regular', color: 'green' },
    { key: 'blockD', label: 'Block D Regular', color: 'yellow' }
  ];

  const blockAPremiumPrice = show.seatTypes?.blockA?.price || '';

  return (
    <div className="space-y-6">
      {/* Seat Type Pricing Section */}
      <div className={`p-4 sm:p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`text-base sm:text-lg font-semibold mb-4 flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Tv className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500" />
          Show Seat Pricing by Block
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seatTypes.map((seat) => (
            <div key={seat.key} className={`p-3 sm:p-4 rounded-lg border-2 ${
              seat.color === 'purple' ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700' :
              seat.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700' :
              seat.color === 'green' ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700' :
              'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700'
            }`}>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {seat.label} (₹)
              </label>
              <input
                type="number"
                value={seat.key === 'blockB' ? blockAPremiumPrice : show.seatTypes?.[seat.key]?.price || ''}
                onChange={(e) => {
                  if (seat.key !== 'blockB') {
                    updateShowSeatType(seat.key, 'price', e.target.value);
                  }
                }}
                readOnly={seat.key === 'blockB'}
                disabled={seat.key === 'blockB'}
                placeholder={`Enter price`}
                className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 ${
                  seat.key === 'blockB'
                    ? 'cursor-not-allowed ' + (isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-500')
                    : (seat.color === 'purple' ? 'focus:ring-purple-500' :
                       seat.color === 'blue' ? 'focus:ring-blue-500' :
                       seat.color === 'green' ? 'focus:ring-green-500' :
                       'focus:ring-yellow-500') + ' ' + 
                      (isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')
                }`}
              />
            </div>
          ))}
        </div>
        
        <div className={`mt-4 p-3 rounded-lg border ${
          isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            💡 Block B automatically matches Block A price. Early bird and bulk discounts apply to all seat types.
          </p>
        </div>
      </div>

      {/* Early Bird Discounts */}
      <EarlyBirdDiscounts
        title="Early Bird Discounts"
        subtitle="Offer discounts for bookings made in advance - applies to all seat types"
        discounts={show.earlyBirdDiscounts || []}
        onAdd={addShowEarlyBird}
        onRemove={removeShowEarlyBird}
        onToggle={toggleShowEarlyBird}
      />

      {/* Bulk Booking Discounts */}
      <BulkBookingDiscounts
        title="Bulk Booking Discounts"
        subtitle="Offer discounts for group bookings - applies to all seat types"
        discounts={show.bulkBookingDiscounts || []}
        onAdd={addShowBulk}
        onRemove={removeShowBulk}
        onToggle={toggleShowBulk}
      />
    </div>
  );
}