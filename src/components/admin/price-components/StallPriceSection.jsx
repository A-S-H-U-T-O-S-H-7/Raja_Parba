// components/admin/price/StallPriceSection.jsx
"use client";
import { Store } from 'lucide-react';
import usePriceStore from '@/lib/stores/usePriceStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import EarlyBirdDiscounts from './EarlyBirdDiscounts';
import BulkBookingDiscounts from './BulkBookingDiscounts';

export default function StallPriceSection() {
  const { isDarkMode } = useThemeStore();
  const {
    stall,
    updateStallSeatPrice,
    addStallEarlyBird,
    removeStallEarlyBird,
    toggleStallEarlyBird,
    addStallBulk,
    removeStallBulk,
    toggleStallBulk
  } = usePriceStore();

  return (
    <div className="space-y-6">
      <div className={`p-4 sm:p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`text-base sm:text-lg font-semibold mb-4 flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Store className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
          Stall Pricing
        </h3>

        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Base Price Per Stall (INR)
          </label>
          <input
            type="number"
            value={stall.seatPrice || ''}
            onChange={(e) => updateStallSeatPrice(e.target.value)}
            placeholder="Enter price per stall"
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border focus:ring-2 focus:ring-green-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            This is the base price for a single stall for the entire event duration.
          </p>
        </div>
      </div>

      <EarlyBirdDiscounts
        title="Early Bird Discounts"
        subtitle="Offer discounts for bookings made in advance"
        discounts={stall.earlyBirdDiscounts || []}
        onAdd={addStallEarlyBird}
        onRemove={removeStallEarlyBird}
        onToggle={toggleStallEarlyBird}
      />

      <BulkBookingDiscounts
        title="Bulk Booking Discounts"
        subtitle="Offer discounts for multiple stall bookings"
        discounts={stall.bulkBookingDiscounts || []}
        onAdd={addStallBulk}
        onRemove={removeStallBulk}
        onToggle={toggleStallBulk}
      />
    </div>
  );
}
