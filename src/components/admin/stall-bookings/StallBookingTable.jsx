// components/admin/stall-bookings/StallBookingTable.jsx
"use client";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Store,
  UserCheck,
  FileText,
  Loader2,
  Calendar,
  IndianRupee,
  Users,
  Mail,
  Phone
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import { format } from 'date-fns';

export default function StallBookingTable({
  bookings,
  loading,
  isUpdating,
  onViewDetails,
  onCancel,
  onParticipation,
  onViewDocuments,
  onStatusUpdate
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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: { icon: CheckCircle, bg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Confirmed' },
      pending: { icon: Clock, bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
      cancelled: { icon: XCircle, bg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelled' },
      'cancellation-requested': { icon: Clock, bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', label: 'Cancellation Requested' }
    };

    const { icon: Icon, bg, label } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg}`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  const getBusinessTypeBadge = (type) => {
    const colors = {
      food: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      handicrafts: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      clothing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      jewelry: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      books: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      toys: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      electronics: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {type || 'General'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className={`rounded-xl border p-12 text-center ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Store className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          No Stall Bookings Found
        </h3>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          There are no stall bookings to display at the moment.
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
                Booking Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Stalls
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
                    ? isDarkMode ? 'bg-green-900/20 hover:bg-green-800/30' : 'bg-green-50 hover:bg-green-100/70'
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
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {booking.vendorDetails?.name}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Mail className="w-3 h-3 mr-1" />
                      {booking.vendorDetails?.email}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Phone className="w-3 h-3 mr-1" />
                      {booking.vendorDetails?.phone}
                    </div>
                    <div className="mt-1">
                      {getBusinessTypeBadge(booking.vendorDetails?.businessType)}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      <Store className="w-3 h-3 mr-1" />
                      {booking.stallIds?.length || 1} Stall{booking.stallIds?.length !== 1 ? 's' : ''}
                    </span>
                    
                    {booking.stallIds?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {booking.stallIds.slice(0, 3).map((stall, idx) => (
                          <span key={idx} className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {stall}
                          </span>
                        ))}
                        {booking.stallIds.length > 3 && (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            +{booking.stallIds.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    {booking.discountApplied > 0 && (
                      <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {booking.discountApplied}% off
                      </span>
                    )}
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
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetails(booking)}
                      className={`p-2 rounded-lg transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => onParticipation(booking)}
                          className={`p-2 rounded-lg transition-all hover:scale-105 ${
                            booking.participated
                              ? isDarkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-600'
                              : isDarkMode ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                          }`}
                          title={booking.participated ? 'Participation Done' : 'Mark Participation'}
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onViewDocuments(booking)}
                          className={`p-2 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode 
                              ? 'bg-purple-800/30 hover:bg-purple-700/50 text-purple-400' 
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                          }`}
                          title="View Documents"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onCancel(booking)}
                          className={`p-2 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode 
                              ? 'bg-red-800/30 hover:bg-red-700/50 text-red-400' 
                              : 'bg-red-100 hover:bg-red-200 text-red-600'
                          }`}
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                          className={`p-2 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode 
                              ? 'bg-green-800/30 hover:bg-green-700/50 text-green-400' 
                              : 'bg-green-100 hover:bg-green-200 text-green-600'
                          }`}
                          title="Confirm Booking"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onCancel(booking)}
                          className={`p-2 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode 
                              ? 'bg-red-800/30 hover:bg-red-700/50 text-red-400' 
                              : 'bg-red-100 hover:bg-red-200 text-red-600'
                          }`}
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
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