// components/admin/stall-bookings/StallBookingDetailsModal.jsx
"use client";
import { X, User, Mail, Phone, Store, Calendar, IndianRupee, Clock, FileText } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import { format } from 'date-fns';

export default function StallBookingDetailsModal({ isOpen, onClose, booking }) {
  const { isDarkMode } = useThemeStore();

  if (!isOpen || !booking) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return format(d, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBusinessTypeDisplay = (type) => {
    const types = {
      food: 'Food & Beverages',
      handicrafts: 'Handicrafts & Arts',
      clothing: 'Clothing & Apparel',
      jewelry: 'Jewelry & Accessories',
      books: 'Books & Literature',
      toys: 'Toys & Games',
      electronics: 'Electronics',
      general: 'General Merchandise'
    };
    return types[type] || type || 'General';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className={`relative w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Store className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-bold text-white">Stall Booking Details</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Info */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <User className="w-5 h-5 mr-2" />
                  Vendor Information
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Name:</span>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.vendorDetails?.name}
                    </p>
                  </div>

                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Email:</span>
                    <p className={`text-sm flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Mail className="w-4 h-4 mr-1" />
                      {booking.vendorDetails?.email}
                    </p>
                  </div>

                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Phone:</span>
                    <p className={`text-sm flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Phone className="w-4 h-4 mr-1" />
                      {booking.vendorDetails?.phone}
                    </p>
                  </div>

                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Business Type:</span>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getBusinessTypeDisplay(booking.vendorDetails?.businessType)}
                    </p>
                  </div>

                  {booking.vendorDetails?.aadhar && (
                    <div>
                      <span className={`text-sm font-medium block ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Aadhar:</span>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {booking.vendorDetails.aadhar}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Info */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h4 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <FileText className="w-5 h-5 mr-2" />
                  Booking Information
                </h4>

                <div className="space-y-3">
                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Booking ID:</span>
                    <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.id}
                    </p>
                  </div>

                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Stalls:</span>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.stallIds?.length || 1} Stall{booking.stallIds?.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {booking.stallIds?.map((stall, idx) => (
                        <span key={idx} className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {stall}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={`text-sm font-medium block ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Total Amount:</span>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Timeline */}
            <div className={`mt-6 p-4 rounded-lg ${
              isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-3 flex items-center ${
                isDarkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                <Clock className="w-5 h-5 mr-2" />
                Status & Timeline
              </h4>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  <span className={`text-sm font-medium mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    Status:
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'confirmed' 
                      ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                      : isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                    Created: {formatDate(booking.createdAt)}
                  </span>
                </div>

                {booking.payment && (
                  <div className="flex items-center">
                    <IndianRupee className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      Payment ID: {booking.payment.paymentId || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex justify-end ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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