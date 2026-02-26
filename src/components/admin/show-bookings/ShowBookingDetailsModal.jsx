// components/admin/ShowBookingDetailsModal.jsx
"use client";
import { format } from 'date-fns';
import { 
  X, 
  User, 
  Calendar, 
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  CreditCard,
  Ticket,
  AlertCircle
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function ShowBookingDetailsModal({ booking, onClose, isOpen = false }) {
  const { isDarkMode } = useThemeStore();

  if (!isOpen) return null;

  if (!booking) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="mb-6">No booking data available to display.</p>
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    try {
      // Handle Firestore Timestamp
      if (date?.toDate) {
        return format(date.toDate(), 'MMMM dd, yyyy \'at\' hh:mm a');
      }
      // Handle Date object or string
      return format(new Date(date), 'MMMM dd, yyyy \'at\' hh:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      if (date?.toDate) {
        return format(date.toDate(), 'MMM dd, yyyy');
      }
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const StatusIcon = getStatusIcon(booking.status);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`max-w-3xl w-full max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                <Ticket className={`w-6 h-6 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Show Booking Details
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Booking ID: {booking.id || booking.bookingId || 'N/A'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <StatusIcon className={`w-8 h-8 ${
                  booking.status === 'confirmed' 
                    ? 'text-green-500' 
                    : booking.status === 'cancelled' 
                    ? 'text-red-500' 
                    : booking.status === 'pending'
                    ? 'text-yellow-500'
                    : 'text-gray-500'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Status
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <Clock className={`w-8 h-8 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Booked At
                  </p>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatDateTime(booking.createdAt || booking.bookingDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <IndianRupee className={`w-8 h-8 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Amount
                  </p>
                  <p className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ₹{(booking.showDetails?.totalPrice || booking.showDetails?.totalAmount || booking.paymentDetails?.amount || booking.payment?.amount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Show Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-md font-semibold mb-3 flex items-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <User className="w-4 h-4 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Full Name</p>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {booking.userDetails?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Email Address</p>
                  <p className={`text-sm flex items-center ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Mail className="w-3 h-3 mr-1" />
                    {booking.userDetails?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Phone Number</p>
                  <p className={`text-sm flex items-center ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Phone className="w-3 h-3 mr-1" />
                    {booking.userDetails?.phone || 'N/A'}
                  </p>
                </div>
                {booking.userDetails?.aadhar && (
                  <div>
                    <p className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Aadhar Number</p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {booking.userDetails.aadhar}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Show Details */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-md font-semibold mb-3 flex items-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Calendar className="w-4 h-4 mr-2" />
                Show Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Show Date & Time</p>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {booking.showDetails?.date ? formatDate(booking.showDetails.date) : 'N/A'}
                    {booking.showDetails?.time && ` (${booking.showDetails.time})`}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Selected Seats ({booking.showDetails?.selectedSeats?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {booking.showDetails?.selectedSeats?.map((seat, index) => {
                      const seatStr = typeof seat === 'string' ? seat : (seat.seatId || seat.id || String(seat));
                      const isVip = seatStr.startsWith('A-') || seatStr.startsWith('B-');
                      return (
                        <span 
                          key={index} 
                          className={`px-2 py-1 rounded text-xs font-medium border ${
                            isVip
                              ? isDarkMode 
                                ? 'bg-purple-900/30 text-purple-300 border-purple-700' 
                                : 'bg-purple-100 text-purple-800 border-purple-200'
                              : isDarkMode 
                                ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {seatStr}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`text-md font-semibold mb-3 flex items-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Amount</p>
                  <p className={`text-lg font-bold ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    ₹{(booking.showDetails?.totalPrice || booking.showDetails?.totalAmount || booking.paymentDetails?.amount || booking.payment?.amount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Payment Status</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {booking.paymentDetails?.status || booking.payment?.status || 'Completed'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Payment Method</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {booking.paymentDetails?.method || booking.payment?.method || 'Online'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Transaction ID</p>
                  <p className={`text-sm font-mono ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {booking.paymentDetails?.transactionId || booking.payment?.transactionId || booking.payment?.razorpayPaymentId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(booking.cancellationReason || booking.updatedAt) && (
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Additional Information
              </h3>
              <div className="space-y-2">
                {booking.cancellationReason && (
                  <div>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Cancellation Reason:</span>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {booking.cancellationReason}
                    </p>
                  </div>
                )}
                {booking.updatedAt && (
                  <div>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Last Updated:</span>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {formatDateTime(booking.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 px-6 py-4 border-t ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}