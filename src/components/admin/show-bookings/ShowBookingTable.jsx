// components/admin/show-bookings/ShowBookingTable.jsx
"use client";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Check,
  Ticket,
  Calendar,
  IndianRupee,
  User,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import { format } from 'date-fns';

export default function ShowBookingTable({
  bookings,
  loading,
  isUpdating,
  currentPage = 1,
  bookingsPerPage = 10,
  onViewDetails,
  onConfirm,
  onCancel,
  onDelete,
  onApproveCancellation,
  onRejectCancellation,
  onParticipation
}) {
  const { isDarkMode } = useThemeStore();

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'N/A';
    try {
      const date = dateValue?.toDate?.() || new Date(dateValue);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: { 
        icon: CheckCircle, 
        bg: isDarkMode ? 'bg-green-900/30 text-green-300 border-green-600' : 'bg-green-50 text-green-700 border-green-200',
        label: 'Confirmed' 
      },
      pending: { 
        icon: Clock, 
        bg: isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-600' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
        label: 'Pending' 
      },
      cancelled: { 
        icon: XCircle, 
        bg: isDarkMode ? 'bg-red-900/30 text-red-300 border-red-600' : 'bg-red-50 text-red-700 border-red-200',
        label: 'Cancelled' 
      },
      'cancellation-requested': { 
        icon: AlertTriangle, 
        bg: isDarkMode ? 'bg-orange-900/30 text-orange-300 border-orange-600' : 'bg-orange-50 text-orange-700 border-orange-200',
        label: 'Cancellation Requested' 
      }
    };

    const { icon: Icon, bg, label } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${bg}`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  const getSeatCategory = (seatId) => {
    if (!seatId) return 'Standard';
    const seatStr = String(seatId);
    if (seatStr.startsWith('A') || seatStr.startsWith('B')) return 'VIP';
    if (seatStr.startsWith('C')) return 'Premium';
    return 'Standard';
  };

  const getSeatStyle = (category) => {
    if (category === 'VIP') {
      return isDarkMode 
        ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' 
        : 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
    if (category === 'Premium') {
      return isDarkMode 
        ? 'bg-blue-900/50 text-blue-300 border-blue-700' 
        : 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return isDarkMode 
      ? 'bg-gray-600 text-gray-300 border-gray-700' 
      : 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const renderActionButtons = (booking) => {
    const baseClass = `p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`;
    
    return (
      <div className="flex items-center justify-center gap-2">
        {/* View Details */}
        <button
          onClick={() => onViewDetails(booking)}
          className={`${baseClass} ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
          }`}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {booking.status === 'confirmed' && (
          <>
            <button
              onClick={() => onParticipation(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                booking.participated
                  ? isDarkMode
                    ? 'bg-green-700 text-green-100 border-green-600 cursor-default'
                    : 'bg-green-600 text-white border-green-600 cursor-default'
                  : isDarkMode
                    ? 'bg-blue-700 hover:bg-blue-600 text-blue-100 border-blue-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
              }`}
              title={booking.participated ? 'Already Participated' : 'Mark Participation'}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCancel(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                isDarkMode 
                  ? 'bg-red-700 hover:bg-red-600 text-red-100 border-red-600' 
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
              }`}
              title="Cancel Booking"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}

        {booking.status === 'cancellation-requested' && (
          <>
            <button
              onClick={() => onApproveCancellation(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                isDarkMode 
                  ? 'bg-green-700 hover:bg-green-600 text-green-100 border-green-600' 
                  : 'bg-green-600 hover:bg-green-700 text-white border-green-600'
              }`}
              title="Approve Cancellation"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRejectCancellation(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                isDarkMode 
                  ? 'bg-red-700 hover:bg-red-600 text-red-100 border-red-600' 
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
              }`}
              title="Reject Cancellation"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className={`rounded-xl border p-12 text-center ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Ticket className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          No Show Bookings Found
        </h3>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          There are no show bookings to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                S.No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Booking
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Show Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {bookings.map((booking, index) => (
              <tr 
                key={booking.id} 
                className={`transition-colors ${
                  booking.participated 
                    ? isDarkMode ? 'bg-green-900/20 hover:bg-green-800/30 border-l-4 border-green-500' : 'bg-green-50 hover:bg-green-100/70 border-l-4 border-green-400'
                    : isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      #{booking.id.slice(-8)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDateTime(booking.createdAt)}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {booking.userDetails?.name || 'N/A'}
                    </div>
                    <div className={`text-xs flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Mail className="w-3 h-3 mr-1" />
                      {booking.userDetails?.email || 'N/A'}
                    </div>
                    <div className={`text-xs flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Phone className="w-3 h-3 mr-1" />
                      {booking.userDetails?.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {(() => {
                        try {
                          const showDate = booking.showDetails?.date;
                          if (!showDate) return 'N/A';
                          
                          let dateObj;
                          if (showDate.toDate) dateObj = showDate.toDate();
                          else if (showDate.seconds) dateObj = new Date(showDate.seconds * 1000);
                          else dateObj = new Date(showDate);
                          
                          if (dateObj && !isNaN(dateObj.getTime())) {
                            return format(dateObj, 'MMM dd, yyyy') + (booking.showDetails?.time ? ` (${booking.showDetails.time})` : '');
                          }
                          return 'N/A';
                        } catch {
                          return 'N/A';
                        }
                      })()}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {booking.showDetails?.selectedSeats?.slice(0, 3).map((seat, idx) => {
                        const seatDisplay = typeof seat === 'object' ? seat.id || seat.seatId || String(seat) : String(seat);
                        const category = getSeatCategory(seatDisplay);
                        return (
                          <span key={idx} className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getSeatStyle(category)}`}>
                            {seatDisplay}
                          </span>
                        );
                      })}
                      {booking.showDetails?.selectedSeats?.length > 3 && (
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          +{booking.showDetails.selectedSeats.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(booking.showDetails?.totalAmount || booking.payment?.amount || 0)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {booking.showDetails?.selectedSeats?.length || 0} seats
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="space-y-2">
                    {getStatusBadge(booking.status)}
                    {booking.participated && (
                      <span className="block text-xs text-green-600 dark:text-green-400">
                        ✓ Participated
                      </span>
                    )}
                    {booking.cancellationReason && (
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} max-w-32`}>
                        <span className="font-medium">Reason:</span> {booking.cancellationReason}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  {renderActionButtons(booking)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}