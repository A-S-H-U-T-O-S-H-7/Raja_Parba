"use client";
import { format, differenceInDays } from 'date-fns';
import { useState, useEffect } from 'react';
import { cancelBooking } from '@/utils/cancellationUtils';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/lib/stores/useAuthStore';
import PassReceiptModal from '../PassReceiptModal';

const toSafeDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (value?.toDate && typeof value.toDate === 'function') {
    const parsed = value.toDate();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
  }
  if (value?.seconds) {
    const parsed = new Date(value.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const StallBookingCard = ({ booking, onCancel }) => {
  const { user } = useAuthStore();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [eventStartDate, setEventStartDate] = useState(toSafeDate(booking.eventDetails?.startDate));
  const [eventEndDate, setEventEndDate] = useState(toSafeDate(booking.eventDetails?.endDate));
  const [eventDuration, setEventDuration] = useState('TBA');

  useEffect(() => {
    const initializeDates = async () => {
      let startDate = toSafeDate(booking.eventDetails?.startDate);
      let endDate = toSafeDate(booking.eventDetails?.endDate);

      if (!startDate || !endDate) {
        try {
          const { getStallEventSettings } = await import('@/services/systemSettingsService');
          const stallSettings = await getStallEventSettings();
          startDate = startDate || toSafeDate(stallSettings.startDate);
          endDate = endDate || toSafeDate(stallSettings.endDate);
        } catch {
          // keep fallback values
        }
      }

      if (startDate && endDate) {
        setEventStartDate(startDate);
        setEventEndDate(endDate);
        const days = differenceInDays(endDate, startDate) + 1;
        setEventDuration(`${days} day${days > 1 ? 's' : ''}`);
      } else {
        setEventStartDate(null);
        setEventEndDate(null);
        setEventDuration('TBA');
      }
    };

    initializeDates();
  }, [booking.eventDetails]);

  const getBusinessTypeDisplay = (businessType) => {
    const businessTypes = {
      food: 'Food & Beverages',
      handicrafts: 'Handicrafts & Arts',
      clothing: 'Clothing & Apparel',
      jewelry: 'Jewelry & Accessories',
      books: 'Books & Literature',
      toys: 'Toys & Games',
      electronics: 'Electronics',
      general: 'General Merchandise'
    };
    return businessTypes[businessType] || businessType || 'General';
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelBooking(
        booking,
        'User requested cancellation - 15+ days before event',
        { uid: user?.uid, name: user?.displayName || user?.email, email: user?.email, isAdmin: false },
        true
      );

      if (result.success) {
        toast.success('Stall booking cancelled successfully. Refund will be processed in 5-7 business days.');
        if (onCancel) onCancel(booking);
      } else {
        toast.error(result.error || 'Failed to cancel stall booking. Please try again.');
      }
    } catch {
      toast.error('Error cancelling stall booking. Please contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  const createdAtDate = toSafeDate(booking.createdAt);
  const eventDateText =
    eventStartDate && eventEndDate
      ? `${format(eventStartDate, 'MMM dd')} - ${format(eventEndDate, 'MMM dd, yyyy')}`
      : 'TBA';

  return (
    <div
      key={booking.id}
      className={`border rounded-xl p-3 sm:p-6 transform hover:scale-[1.02] transition-all duration-200 ${
        booking.status === 'cancelled'
          ? 'border-red-200 bg-red-50 shadow-md'
          : 'border-gray-200 bg-white shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                booking.status === 'confirmed'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : booking.status === 'cancelled'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}
            >
              {booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'cancelled' ? 'Cancelled' : booking.status}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              {booking.stallIds && booking.stallIds.length > 1 ? 'Multi-Stall Booking' : 'Stall Booking'}
            </span>
          </div>
          <span className="inline-flex items-center rounded-md border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-1 font-mono text-xs sm:text-sm font-semibold text-blue-700">
            ID: {booking.bookingId || 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">EVENT PERIOD</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{eventDateText}</p>
            <p className="text-xs text-gray-600">{eventDuration}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">STALL DETAILS</p>
            <p className="text-sm font-bold text-gray-900">
              {booking.stallIds && booking.stallIds.length > 0
                ? `${booking.stallIds.length} Stall${booking.stallIds.length > 1 ? 's' : ''}`
                : booking.stallId
                ? `Stall ${booking.stallId}`
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {booking.stallIds && booking.stallIds.length > 0
                ? booking.stallIds.slice(0, 3).join(', ') + (booking.stallIds.length > 3 ? ` +${booking.stallIds.length - 3} more` : '')
                : booking.stallDetails?.size || 'Standard size'}
            </p>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">BUSINESS TYPE</p>
            <p className="text-sm font-bold text-gray-900">
              {getBusinessTypeDisplay(booking.vendorDetails?.businessType || booking.businessType)}
            </p>
            <p className="text-xs text-gray-600 truncate">{booking.vendorDetails?.businessName || 'No description'}</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">TOTAL AMOUNT</p>
            <p className="text-lg font-bold text-green-600">
              Rs {(booking.totalAmount || booking.payment?.amount || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {booking.stallIds && booking.stallIds.length > 1 && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">BOOKED STALLS</p>
            <div className="flex flex-wrap gap-2">
              {booking.stallIds.map((stallId, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-300"
                >
                  {stallId}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-200 gap-3">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Booked: {createdAtDate ? format(createdAtDate, "MMM dd, yyyy 'at' hh:mm a") : 'Unknown'}</p>
          </div>

          {booking.status === 'confirmed' && (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setIsPassModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md min-w-[120px]"
              >
                Pass and Receipt
              </button>
            </div>
          )}
        </div>
      </div>

      <PassReceiptModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} booking={booking} />
    </div>
  );
};

export default StallBookingCard;
