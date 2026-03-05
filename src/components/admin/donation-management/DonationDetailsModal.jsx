// components/admin/donation-management/DonationDetailsModal.jsx
"use client";

import { useState } from 'react';
import {
  X,
  Heart,
  User,
  IndianRupee,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Home,
  Shield,
  Loader2,
  Ban,
  Hash,
  Calendar
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useDonationStore from '@/lib/stores/useDonationStore';
import { format, isValid } from 'date-fns';

export default function DonationDetailsModal({ donation, isOpen, onClose, onRefresh }) {
  const { isDarkMode } = useThemeStore();
  const isDark = isDarkMode;
  const { updateDonationStatus } = useDonationStore();
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !donation) return null;

  const formatDate = (date, formatString = 'MMM dd, yyyy') => {
    if (!date) return 'N/A';
    try {
      let dateObj;
      if (date && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else {
        return 'N/A';
      }
      if (!isValid(dateObj)) return 'N/A';
      return format(dateObj, formatString);
    } catch {
      return 'N/A';
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    const result = await updateDonationStatus(donation.id, newStatus);
    if (result.success) {
      onRefresh();
      onClose();
    }
    setUpdating(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: isDark ? "text-green-400" : "text-green-600",
      completed: isDark ? "text-green-400" : "text-green-600",
      pending_payment: isDark ? "text-yellow-400" : "text-yellow-600",
      failed: isDark ? "text-red-400" : "text-red-600",
      cancelled: isDark ? "text-gray-400" : "text-gray-600",
    };
    return colors[status] || (isDark ? "text-gray-400" : "text-gray-600");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-xl overflow-hidden ${
          isDark 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" 
            : "bg-gradient-to-br from-white to-indigo-50/50 border-indigo-100"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? "border-gray-700" : "border-indigo-100"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-indigo-900/30" : "bg-indigo-100"}`}>
              <Heart className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Donation Details
              </h3>
              <p className={`text-sm mt-1 font-mono ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {donation.donationId || donation.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${
              isDark 
                ? "hover:bg-gray-700 text-gray-400" 
                : "hover:bg-indigo-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-semibold capitalize ${getStatusColor(donation.status)}`}>
              {donation.status?.replace('_', ' ') || 'pending'}
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
              donation.donorType === 'foreign'
                ? isDark
                  ? 'bg-blue-900/30 text-blue-300 border-blue-700'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
                : isDark
                  ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {donation.donorType === 'foreign' ? 'NRI/Foreign' : 'Indian'} Donor
            </span>
            {donation.taxExemption?.eligible && (
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                isDark
                  ? 'bg-indigo-900/30 text-indigo-300 border-indigo-700'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                80G Eligible
              </span>
            )}
          </div>

          {/* Amount Card */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Amount</p>
                <p className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                  ₹{(donation.amount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Currency</p>
                <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {donation.currency || 'INR'}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Purpose</p>
                <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {donation.purpose || 'General'}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Created</p>
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatDate(donation.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Donor Information */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
          }`}>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}>
              <User className="w-4 h-4" />
              Donor Information
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Name</p>
                  <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {donation.donorDetails?.name || 'Anonymous'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {donation.donorDetails?.email || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Mobile</p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {donation.donorDetails?.mobile || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Home className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Address</p>
                  {donation.donorDetails?.address ? (
                    <div>
                      <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {donation.donorDetails.address}
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {[
                          donation.donorDetails?.city,
                          donation.donorDetails?.state,
                          donation.donorDetails?.country,
                          donation.donorDetails?.pincode
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
          }`}>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}>
              <CreditCard className="w-4 h-4" />
              Payment Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Gateway</p>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {donation.paymentGateway || 'CCAvenue'}
                </p>
              </div>

              {donation.paymentDetails?.tracking_id && (
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Tracking ID</p>
                  <p className={`text-sm font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {donation.paymentDetails.tracking_id}
                  </p>
                </div>
              )}

              {donation.paymentDetails?.bank_ref_no && (
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Bank Ref</p>
                  <p className={`text-sm font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {donation.paymentDetails.bank_ref_no}
                  </p>
                </div>
              )}

              {donation.paymentDetails?.payment_mode && (
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Payment Method</p>
                  <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {donation.paymentDetails.payment_mode}
                  </p>
                </div>
              )}
            </div>

            {donation.confirmedAt && (
              <div className={`mt-4 p-3 rounded-lg border ${
                isDark ? "bg-green-900/10 border-green-800" : "bg-green-50 border-green-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className={`h-4 w-4 mr-2 ${isDark ? "text-green-400" : "text-green-600"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-green-300" : "text-green-700"}`}>
                      Confirmed On
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? "text-green-300" : "text-green-700"}`}>
                    {formatDate(donation.confirmedAt)}
                  </span>
                </div>
              </div>
            )}

            {donation.paymentDetails?.failure_message && (
              <div className={`mt-4 p-3 rounded-lg border ${
                isDark ? "bg-red-900/10 border-red-800" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-start">
                  <XCircle className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${isDark ? "text-red-400" : "text-red-600"}`} />
                  <div>
                    <span className={`text-sm font-medium ${isDark ? "text-red-300" : "text-red-700"}`}>
                      Failure Reason
                    </span>
                    <p className={`text-xs mt-1 ${isDark ? "text-red-200" : "text-red-600"}`}>
                      {donation.paymentDetails.failure_message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* System Info */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200"
          }`}>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}>
              <Shield className="w-4 h-4" />
              System Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Created Date</p>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatDate(donation.createdAt)}
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {formatDate(donation.createdAt, 'hh:mm:ss a')}
                </p>
              </div>

              {donation.userId && (
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>User ID</p>
                  <p className={`text-sm font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {donation.userId}
                  </p>
                </div>
              )}

              <div>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Document ID</p>
                <p className={`text-sm font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {donation.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`px-6 py-4 border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {donation.status === 'pending_payment' && (
                <button
                  onClick={() => handleUpdateStatus('confirmed')}
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 font-medium inline-flex items-center text-sm"
                >
                  {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Mark Confirmed
                </button>
              )}
              {donation.status !== 'cancelled' && donation.status !== 'failed' && (
                <button
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={updating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 font-medium inline-flex items-center text-sm"
                >
                  {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Ban className="h-4 w-4 mr-2" />}
                  Cancel
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className={`px-4 py-2 border rounded-lg transition-all duration-200 font-medium text-sm ${
                isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
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