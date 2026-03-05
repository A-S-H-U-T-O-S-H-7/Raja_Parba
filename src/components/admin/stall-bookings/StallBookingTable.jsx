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
  Mail,
  Phone,
  IndianRupee
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import { format } from 'date-fns';
import Pagination from '../shared/Pagination';

export default function StallBookingTable({
  bookings,
  loading,
  isUpdating,
  onViewDetails,
  onCancel,
  onParticipation,
  onViewDocuments,
  onStatusUpdate,
  currentPage,
  totalPages,
  totalBookings,
  bookingsPerPage,
  onPageChange
}) {
  const { isDarkMode } = useThemeStore();
  const isDark = isDarkMode;

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
      return format(new Date(date), 'dd/MM/yyyy, hh:mm:ss a');
    } catch {
      return 'N/A';
    }
  };

  const getStatusColors = (status) => {
    if (isDark) {
      switch(status) {
        case 'confirmed': return 'bg-green-900/60 text-green-200 border border-green-700';
        case 'pending': return 'bg-yellow-900/60 text-yellow-200 border border-yellow-700';
        case 'pending_payment': return 'bg-orange-900/60 text-orange-200 border border-orange-700';
        case 'cancelled': return 'bg-red-900/60 text-red-200 border border-red-700';
        case 'cancellation-requested': return 'bg-orange-900/60 text-orange-200 border border-orange-700';
        default: return 'bg-gray-700 text-gray-200 border border-gray-600';
      }
    }
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'pending_payment': return 'bg-orange-100 text-orange-700 border border-orange-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-300';
      case 'cancellation-requested': return 'bg-orange-100 text-orange-700 border border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getBusinessTypeColors = (type) => {
    if (isDark) {
      switch(type?.toLowerCase()) {
        case 'food': return 'bg-red-900/60 text-red-200 border border-red-700';
        case 'handicrafts': return 'bg-amber-900/60 text-amber-200 border border-amber-700';
        case 'clothing': return 'bg-blue-900/60 text-blue-200 border border-blue-700';
        case 'jewelry': return 'bg-purple-900/60 text-purple-200 border border-purple-700';
        case 'books': return 'bg-indigo-900/60 text-indigo-200 border border-indigo-700';
        case 'toys': return 'bg-pink-900/60 text-pink-200 border border-pink-700';
        case 'electronics': return 'bg-cyan-900/60 text-cyan-200 border border-cyan-700';
        case 'home & garden': return 'bg-emerald-900/60 text-emerald-200 border border-emerald-700';
        default: return 'bg-gray-700 text-gray-200 border border-gray-600';
      }
    }
    switch(type?.toLowerCase()) {
      case 'food': return 'bg-red-100 text-red-700 border border-red-300';
      case 'handicrafts': return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'clothing': return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'jewelry': return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'books': return 'bg-indigo-100 text-indigo-700 border border-indigo-300';
      case 'toys': return 'bg-pink-100 text-pink-700 border border-pink-300';
      case 'electronics': return 'bg-cyan-100 text-cyan-700 border border-cyan-300';
      case 'home & garden': return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  // Table headers configuration
  const tableHeaders = [
    { label: "S.No", width: "20px" },
    { label: "Booking Details", width: "120px" },
    { label: "Vendor Information", width: "200px" },
    { label: "Stall Details", width: "200px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "130px" },
    { label: "Actions", width: "180px" }
  ];

  const headerStyle = `px-4 py-3 text-center text-sm font-bold border-r ${
    isDark 
      ? "text-blue-100 border-indigo-700/50" 
      : "text-indigo-900 border-indigo-200/70"
  }`;

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 rounded-2xl border-2 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="text-center">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            isDark ? "text-indigo-400" : "text-indigo-600"
          }`} />
          <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className={`rounded-2xl border-2 p-12 text-center ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Store className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No Stall Bookings Found
        </h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          There are no stall bookings to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl shadow-2xl border-2 overflow-hidden ${
      isDark
        ? "bg-gray-800 border-indigo-600/50 shadow-indigo-900/20"
        : "bg-white border-indigo-300 shadow-indigo-500/10"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "900px" }}>
          <thead className={`border-b-2 ${
            isDark
              ? "bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 border-indigo-600/50"
              : "bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 border-indigo-300"
          }`}>
            <tr>
              {tableHeaders.map((header, index) => (
                <th 
                  key={index}
                  className={headerStyle}
                  style={{ minWidth: header.width }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isDark ? "bg-gray-800" : "bg-white"}>
	            {bookings.map((booking, index) => {
	              const serialNo = (currentPage - 1) * bookingsPerPage + index + 1;
	              const isParticipated = booking.participated;
	              const rowBgColor = isDark 
                ? index % 2 === 0 
                  ? 'bg-gray-800' 
                  : 'bg-gray-700/30'
                : index % 2 === 0 
                  ? 'bg-white' 
                  : 'bg-gray-50';
              
              return (
                <tr 
                  key={booking.id} 
                  className={`border-b transition-all duration-200 hover:shadow-lg ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-200 hover:bg-indigo-50/50"
                  } ${rowBgColor} ${isParticipated ? isDark ? "bg-green-900/20" : "bg-green-50/50" : ""}`}
                >
                  {/* S.No */}
	                  <td className={`px-4 py-4 text-center border-r ${
	                    isDark ? "border-gray-700" : "border-gray-300"
	                  }`}>
	                    <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
	                      {serialNo.toString().padStart(2, '0')}
	                    </span>
	                  </td>

                  {/* Booking Details */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col space-y-1">
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        #{booking.id?.slice(-8) || 'N/A'}
                      </span>
                      <div className="flex items-center text-xs">
                        <Calendar className={`w-3 h-3 mr-1 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Vendor Information */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col space-y-2">
                      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {booking.vendorDetails?.name || 'N/A'}
                      </span>
                      <div className="flex items-center text-xs">
                        <Phone className={`w-3 h-3 mr-1 flex-shrink-0 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                          {booking.vendorDetails?.phone || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Mail className={`w-3 h-3 mr-1 flex-shrink-0 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={`truncate max-w-[180px] ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {booking.vendorDetails?.email || 'N/A'}
                        </span>
                      </div>
                      {booking.vendorDetails?.businessType && (
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-md ${getBusinessTypeColors(booking.vendorDetails.businessType)}`}>
                          {booking.vendorDetails.businessType}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stall Details */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Store className={`w-3 h-3 mr-1 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {booking.stallIds?.length || 1} Stall{booking.stallIds?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {booking.stallDetails && booking.stallDetails.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {booking.stallDetails.slice(0, 3).map((stall, idx) => (
                            <div key={idx} className="flex flex-col">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                isDark 
                                  ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {stall.stallNumber || stall.stallId || `Stall ${idx + 1}`}
                              </span>
                              {stall.category && (
                                <span className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {stall.category}
                                </span>
                              )}
                            </div>
                          ))}
                          {booking.stallDetails.length > 3 && (
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              isDark 
                                ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                                : 'bg-gray-200 text-gray-600 border border-gray-300'
                            }`}>
                              +{booking.stallDetails.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {booking.stallIds?.map((stallId, idx) => (
                            <span key={idx} className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              isDark 
                                ? 'bg-blue-900/50 text-blue-300 border border-blue-700' 
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {stallId}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        {formatCurrency(booking.totalAmount)}
                      </span>
                      {booking.discountApplied > 0 && (
                        <span className={`text-xs mt-1 px-2 py-0.5 rounded ${
                          isDark 
                            ? 'bg-green-900/30 text-green-300 border border-green-700' 
                            : 'bg-green-100 text-green-700 border border-green-300'
                        }`}>
                          {booking.discountApplied}% off
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col items-start space-y-2">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${getStatusColors(booking.status)}`}>
                        {booking.status === 'cancellation-requested' ? 'Cancellation Requested' : 
                         booking.status === 'pending_payment' ? 'Pending Payment' :
                         booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                      </span>
                      {isParticipated && (
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${
                          isDark 
                            ? 'bg-green-900/60 text-green-200 border border-green-700' 
                            : 'bg-green-100 text-green-700 border border-green-300'
                        }`}>
                          ✓ Participated
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className={`px-4 py-4 ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      {/* View Details - Always visible */}
                      <button
                        onClick={() => onViewDetails(booking)}
                        className={`p-2 rounded-lg transition-all hover:scale-105 ${
                          isDark 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* View Documents - Always visible */}
                      <button
                        onClick={() => onViewDocuments(booking)}
                        className={`p-2 rounded-lg transition-all hover:scale-105 ${
                          isDark 
                            ? 'bg-purple-900/60 hover:bg-purple-800/60 text-purple-300 border border-purple-700' 
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300'
                        }`}
                        title="View Documents"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Status specific actions */}
                      {booking.status === 'confirmed' && !isParticipated && (
                        <>
                          <button
                            onClick={() => onParticipation(booking)}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-blue-900/60 hover:bg-blue-800/60 text-blue-300 border border-blue-700' 
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300'
                            }`}
                            title="Mark Participation"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onCancel(booking)}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-red-900/60 hover:bg-red-800/60 text-red-300 border border-red-700' 
                                : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                            }`}
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {(booking.status === 'pending' || booking.status === 'pending_payment') && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-green-900/60 hover:bg-green-800/60 text-green-300 border border-green-700' 
                                : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                            }`}
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onCancel(booking)}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-red-900/60 hover:bg-red-800/60 text-red-300 border border-red-700' 
                                : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination inside table */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalBookings}
          itemsPerPage={bookingsPerPage}
          onPageChange={onPageChange}
        />
      )}

      {/* Loading Overlay */}
      {isUpdating && (
        <div className={`absolute inset-0 backdrop-blur-sm flex items-center justify-center ${
          isDark ? "bg-gray-900/80" : "bg-white/80"
        }`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
