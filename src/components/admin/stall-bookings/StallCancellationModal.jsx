// components/admin/stall-bookings/StallCancellationModal.jsx
"use client";
import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Store, User, IndianRupee, Loader2 } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function StallCancellationModal({
  isOpen,
  onClose,
  booking,
  onConfirm,
  isUpdating
}) {
  const { isDarkMode } = useThemeStore();
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  if (!isOpen || !booking) return null;

  const predefinedReasons = [
    'Vendor Request',
    'Event Cancelled',
    'Payment Failed',
    'Policy Violation',
    'Overbooking',
    'Other'
  ];

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleReasonSelect = (r) => {
    setSelectedReason(r);
    setReason(r === 'Other' ? '' : r);
  };

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-bold text-white">Cancel Stall Booking</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Warning */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex">
                  <AlertTriangle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-500'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                      Confirm Cancellation
                    </h4>
                    <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                      <li>• Release reserved stalls</li>
                      <li>• Update status to "Cancelled"</li>
                      <li>• May require refund processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Booking Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Booking ID:</span>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {booking.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Vendor:</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {booking.vendorDetails?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stalls:</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {booking.stallIds?.length || 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount:</span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="mb-4">
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Reason for Cancellation *
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {predefinedReasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleReasonSelect(r)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      selectedReason === r
                        ? isDarkMode
                          ? 'border-red-500 bg-red-900/30 text-red-300'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : isDarkMode
                          ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {selectedReason === 'Other' && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Please specify the reason..."
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex justify-end gap-3 ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isUpdating || !selectedReason || (selectedReason === 'Other' && !reason.trim())}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center ${
                isUpdating || !selectedReason || (selectedReason === 'Other' && !reason.trim())
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Cancellation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}