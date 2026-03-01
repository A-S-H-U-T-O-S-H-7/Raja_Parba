// components/show/ShowSeatSelection.jsx
"use client";
import { Calendar, Clock, Users, ShoppingBag, Info, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import useUserShowBookingStore from '@/lib/stores/useUserShowBooking';
import ShowAuditorium from './ShowAuditorium';

export default function ShowSeatSelection() {
  const { 
    selectedDate, 
    selectedSeats,
    getTotalAmount,
    getDiscountAmount,
    getBaseAmount,
    getEarlyBirdDiscount,
    getBulkDiscount,
    getNextMilestone,
    getCurrentDiscountInfo,
    showSettings
  } = useUserShowBookingStore();

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const activeShows = showSettings?.shows?.filter(
    (show) => show?.active === true || show?.isActive === true
  ) || [];
  const currentShow = activeShows.length > 0 ? activeShows[0] : null;

  return (
    <div className="space-y-6 p-0 md:p-2">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Places</h2>
        <p className="text-gray-600">Select your preferred places</p>
      </div>

      {/* Show Information */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 border border-gray-300 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-gray-900 font-semibold">Show Details</h3>
              <p className="text-gray-600 text-sm">
                {selectedDate ? (
                  typeof selectedDate === 'string' 
                    ? format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')
                    : format(selectedDate, 'EEEE, MMMM d, yyyy')
                ) : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <div className="text-right">
              {currentShow ? (
                <>
                  <p className="text-gray-900 font-semibold">{currentShow.name}</p>
                  <p className="text-gray-600 text-sm">
                    {formatTime(currentShow.timeFrom || currentShow.startTime)} - {formatTime(currentShow.timeTo || currentShow.endTime)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-900 font-semibold">Evening Show</p>
                  <p className="text-gray-600 text-sm">5:00 PM - 10:00 PM</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auditorium Layout */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-2 border border-gray-300 backdrop-blur-sm">
        <ShowAuditorium />
      </div>

      {/* Selected Seats Summary - RESTORED */}
      {selectedSeats.length > 0 && (
        <div className="bg-white border border-blue-200 rounded-xl p-4 md:py-2 md:px-6 shadow-lg sticky bottom-4 z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h4 className="text-lg sm:text-xl font-semibold text-blue-800">
                  Selected Seats ({selectedSeats.length})
                </h4>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSeats.slice(0, 10).map(seatId => (
                  <div key={seatId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-flex items-center">
                    {seatId}
                  </div>
                ))}
                {selectedSeats.length > 10 && (
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    +{selectedSeats.length - 10} more
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center sm:text-right bg-blue-50 rounded-lg p-2 border border-blue-200 w-full sm:w-auto min-w-[200px]">
              {/* Current Total */}
              <div className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">
                ₹{getTotalAmount().toLocaleString()}
              </div>
              
              {/* Base calculation */}
              {getDiscountAmount() > 0 ? (
                <div className="text-xs text-gray-600 space-y-0.5 mb-1">
                  <div className="line-through">
                    ₹{getBaseAmount().toLocaleString()}
                  </div>
                  <div className="text-green-600 font-medium">
                    -₹{getDiscountAmount().toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-600 mb-1">
                  {selectedSeats.length} seats
                </div>
              )}
              
              {/* Discount Badges */}
              <div className="space-y-0.5">
                {getEarlyBirdDiscount() > 0 && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    🎉 {getEarlyBirdDiscount()}% Early Bird!
                  </div>
                )}
                
                {getBulkDiscount() > 0 && (
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    🎯 {getBulkDiscount()}% Bulk!
                  </div>
                )}
                
                {/* Next Milestone */}
                {(() => {
                  const milestone = getNextMilestone();
                  if (milestone) {
                    return (
                      <div className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Add {milestone.quantityNeeded} more for {milestone.discountPercent}% discount
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
          
          {/* Scroll Down Section */}
          <div className="mt-1 flex justify-end border-gray-200">
            <div className="flex max-w-[200px] items-center gap-2 bg-rose-50 border border-rose-200 rounded px-2 py-1">
              <div className="flex items-center gap-1">
                <Info className="h-3 w-3 text-rose-500 flex-shrink-0" />
                <span className="text-rose-800 text-xs font-medium">
                  Scroll down to proceed next
                </span>
              </div>
              <button 
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                  });
                }}
                className="relative focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 rounded-full transition-transform hover:scale-110"
                aria-label="Scroll to bottom of page"
              >
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center animate-pulse shadow-lg cursor-pointer">
                  <ChevronDown className="w-5 h-5 text-white animate-bounce" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
