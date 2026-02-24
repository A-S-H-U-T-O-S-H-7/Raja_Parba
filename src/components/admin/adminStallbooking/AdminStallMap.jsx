// components/admin/bookings/stalls/AdminStallMap.jsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import { Store, ShoppingBag, Info, TrendingUp, Check, Lock, Calendar } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useStallBookingStore from '@/lib/stores/useStallBookingStore';
import useThemeStore from '@/lib/stores/useThemeStore';

const GRID_COLUMNS = 14;

export default function AdminStallMap() {
  const { isDarkMode } = useThemeStore();
  const { 
    selectedStalls, 
    toggleStall,
    stallAvailability,
    stallSettings,
    priceSettings,
    getTotalAmount,
    getBaseAmount,
    getDiscountAmount,
    getEarlyBirdDiscount,
    getBulkDiscount,
    getNextMilestone,
    loadStallData
  } = useStallBookingStore();

  const [loading, setLoading] = useState(true);
  const [hoveredStall, setHoveredStall] = useState(null);

  // Real-time availability listener
  useEffect(() => {
    const availabilityRef = doc(db, 'stallAvailability', 'current');
    
    const unsubscribe = onSnapshot(availabilityRef, (doc) => {
      if (doc.exists()) {
        useStallBookingStore.setState({ 
          stallAvailability: doc.data().stalls || {} 
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to stall availability:', error);
      toast.error('Failed to load stall availability');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Generate stalls
  const allStalls = useMemo(() => {
    if (stallSettings?.stalls?.length > 0) {
      return stallSettings.stalls.map((stall, index) => ({
        ...stall,
        row: Math.floor(index / GRID_COLUMNS) + 1,
        column: (index % GRID_COLUMNS) + 1
      }));
    }
    
    return Array.from({ length: 70 }, (_, i) => ({
      id: `S${i + 1}`,
      number: i + 1,
      name: `Stall S${i + 1}`,
      price: priceSettings.defaultStallPrice,
      row: Math.floor(i / GRID_COLUMNS) + 1,
      column: (i % GRID_COLUMNS) + 1
    }));
  }, [stallSettings, priceSettings]);

  // Get stall status
  const getStallStatus = (stallId) => {
    const availability = stallAvailability[stallId];
    if (!availability) return 'available';
    if (availability.blocked) return 'blocked';
    if (availability.booked) return 'booked';
    return 'available';
  };

  // Get stall color
  const getStallColor = (stallId) => {
    const status = getStallStatus(stallId);
    const isSelected = selectedStalls.includes(stallId);
    const isHovered = hoveredStall === stallId;
    
    if (isSelected) {
      return isDarkMode
        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900 shadow-xl scale-105 z-10'
        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300 ring-offset-2 ring-offset-white shadow-xl scale-105 z-10';
    }
    
    if (status === 'booked') {
      return isDarkMode
        ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 border border-gray-600 opacity-80 cursor-not-allowed'
        : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white border border-gray-300 opacity-80 cursor-not-allowed';
    }
    
    if (status === 'blocked') {
      return isDarkMode
        ? 'bg-gradient-to-br from-red-900/80 to-red-800/80 text-red-200 border border-red-700 cursor-not-allowed'
        : 'bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-400 cursor-not-allowed';
    }
    
    return isDarkMode
      ? `bg-gradient-to-br from-emerald-700 to-emerald-600 text-emerald-100 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-600 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${isHovered ? 'scale-105 shadow-xl' : ''}`
      : `bg-gradient-to-br from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 border border-emerald-400 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${isHovered ? 'scale-105 shadow-xl' : ''}`;
  };

  const handleStallClick = (stallId) => {
    const status = getStallStatus(stallId);
    if (status !== 'available' && !selectedStalls.includes(stallId)) {
      toast.error(`Stall ${stallId} is ${status}`);
      return;
    }
    toggleStall(stallId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Store className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Select Stalls
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Click on available stalls to select them for the vendor
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-green-500"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-gray-400 to-gray-500"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blocked</span>
          </div>
        </div>
      </div>

      {/* Stall Grid */}
      <div className={`rounded-xl border p-6 ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="grid grid-cols-14 gap-2">
          {allStalls.map(stall => {
            const status = getStallStatus(stall.id);
            const isSelected = selectedStalls.includes(stall.id);
            
            return (
              <button
                key={stall.id}
                onClick={() => handleStallClick(stall.id)}
                onMouseEnter={() => setHoveredStall(stall.id)}
                onMouseLeave={() => setHoveredStall(null)}
                disabled={status !== 'available' && !isSelected}
                className={`
                  relative aspect-square rounded-lg font-medium text-xs
                  flex flex-col items-center justify-center
                  ${getStallColor(stall.id)}
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                  ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
                `}
              >
                <Store className="w-3 h-3 mb-0.5" />
                <span>{stall.number}</span>
                
                {status === 'blocked' && (
                  <Lock className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-red-300" />
                )}
                
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedStalls.length > 0 && (
        <div className={`rounded-xl border-2 p-6 ${
          isDarkMode 
            ? 'bg-emerald-900/20 border-emerald-700/50' 
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Selected Stalls ({selectedStalls.length})
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedStalls.slice(0, 10).map(stallId => (
                  <div
                    key={stallId}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {stallId}
                  </div>
                ))}
                {selectedStalls.length > 10 && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 border border-gray-600'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    +{selectedStalls.length - 10} more
                  </div>
                )}
              </div>
            </div>

            <div className={`text-right p-4 rounded-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg min-w-[200px]`}>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{getTotalAmount().toLocaleString()}
              </div>
              
              {getDiscountAmount() > 0 && (
                <div className="text-sm text-gray-500 line-through mt-1">
                  ₹{getBaseAmount().toLocaleString()}
                </div>
              )}

              <div className="mt-2 space-y-1">
                {getEarlyBirdDiscount() > 0 && (
                  <div className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs">
                    🎉 {getEarlyBirdDiscount()}% Early Bird
                  </div>
                )}
                
                {getBulkDiscount() > 0 && (
                  <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs ml-2">
                    🎯 {getBulkDiscount()}% Bulk Discount
                  </div>
                )}
              </div>

              {getNextMilestone() && (
                <div className="mt-3 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 p-2 rounded-lg">
                  Add {getNextMilestone().quantityNeeded} more for {getNextMilestone().discountPercent}% discount
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}