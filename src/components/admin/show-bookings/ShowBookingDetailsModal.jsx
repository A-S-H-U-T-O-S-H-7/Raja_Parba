// components/admin/show-bookings/ShowBookingDetailsModal.jsx
"use client";

import { format } from "date-fns";
import {
  X,
  User,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  CreditCard,
  Ticket,
  AlertCircle,
  UserCheck
} from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function ShowBookingDetailsModal({ booking, onClose, isOpen = false }) {
  const { isDarkMode } = useThemeStore();

  if (!isOpen) return null;

  if (!booking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-200 bg-white text-gray-900"}`}>
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-lg font-semibold">Booking data not found</p>
          </div>
          <button
            onClick={onClose}
            className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const normalizeDate = (value) => {
    if (!value) return null;
    if (value?.toDate && typeof value.toDate === "function") return value.toDate();
    if (value?.seconds) return new Date(value.seconds * 1000);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatDateTime = (value) => {
    const date = normalizeDate(value);
    if (!date) return "N/A";
    return format(date, "dd MMM yyyy, hh:mm a");
  };

  const formatDateOnly = (value) => {
    const date = normalizeDate(value);
    if (!date) return "N/A";
    return format(date, "dd MMM yyyy");
  };

  const getStatusConfig = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return {
          icon: CheckCircle,
          badge: isDarkMode ? "bg-green-900/30 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200",
          label: "Confirmed"
        };
      case "cancelled":
        return {
          icon: XCircle,
          badge: isDarkMode ? "bg-red-900/30 text-red-300 border-red-700" : "bg-red-50 text-red-700 border-red-200",
          label: "Cancelled"
        };
      default:
        return {
          icon: Clock,
          badge: isDarkMode ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" : "bg-yellow-50 text-yellow-700 border-yellow-200",
          label: "Pending"
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const seats = booking.showDetails?.selectedSeats || [];
  const amount = booking.showDetails?.totalPrice || booking.showDetails?.totalAmount || booking.paymentDetails?.amount || booking.payment?.amount || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center">
        <div className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border shadow-2xl ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
          <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? "border-gray-700 bg-gray-900/95" : "border-gray-200 bg-white/95"}`}>
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2 ${isDarkMode ? "bg-rose-900/30" : "bg-rose-100"}`}>
                <Ticket className={`h-5 w-5 ${isDarkMode ? "text-rose-300" : "text-rose-700"}`} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Show Booking Details</h2>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{booking.bookingId || booking.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`rounded-lg p-2 ${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900" : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Status</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusIcon className="h-4 w-4" />
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig.badge}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              <div className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900" : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Booking Date</p>
                <p className={`mt-2 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{formatDateTime(booking.createdAt || booking.bookingDate)}</p>
              </div>
              <div className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900" : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Amount</p>
                <p className={`mt-2 text-sm font-bold ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)}
                </p>
              </div>
              <div className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900" : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Participation</p>
                <div className="mt-2 flex items-center gap-2">
                  <UserCheck className={`h-4 w-4 ${booking.participated ? "text-green-500" : isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${booking.participated ? "text-green-600" : isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {booking.participated ? "Marked Participated" : "Not Marked"}
                  </span>
                </div>
                {booking.participatedAt && (
                  <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{formatDateTime(booking.participatedAt)}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gray-800/60" : "border-gray-200 bg-gray-50/80"}`}>
                <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{booking.userDetails?.name || "N/A"}</p>
                  <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <Mail className="h-3.5 w-3.5" />
                    {booking.userDetails?.email || "N/A"}
                  </p>
                  <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <Phone className="h-3.5 w-3.5" />
                    {booking.userDetails?.phone || "N/A"}
                  </p>
                </div>
              </section>

              <section className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gray-800/60" : "border-gray-200 bg-gray-50/80"}`}>
                <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <Calendar className="h-4 w-4" />
                  Show Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                    {formatDateOnly(booking.showDetails?.date)}
                    {booking.showDetails?.time ? ` (${booking.showDetails.time})` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {seats.map((seat, index) => {
                      const label = typeof seat === "string" ? seat : seat?.seatId || seat?.id || String(seat);
                      return (
                        <span
                          key={`${label}-${index}`}
                          className={`rounded-md border px-2 py-1 text-xs font-semibold ${isDarkMode ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-white text-gray-700"}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>

            <section className={`rounded-xl border p-4 ${isDarkMode ? "border-gray-700 bg-gray-800/60" : "border-gray-200 bg-gray-50/80"}`}>
              <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                <CreditCard className="h-4 w-4" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Amount</p>
                  <p className={`font-semibold ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Payment Status</p>
                  <p className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{booking.paymentDetails?.status || booking.payment?.status || "N/A"}</p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Transaction ID</p>
                  <p className={`break-all font-mono text-xs ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {booking.paymentDetails?.transactionId || booking.payment?.transactionId || booking.payment?.razorpayPaymentId || "N/A"}
                  </p>
                </div>
              </div>
            </section>

            {(booking.cancellationReason || booking.updatedAt) && (
              <section className={`rounded-xl border p-4 ${isDarkMode ? "border-red-800/50 bg-red-900/10" : "border-red-200 bg-red-50/60"}`}>
                <h3 className={`mb-2 text-sm font-semibold ${isDarkMode ? "text-red-300" : "text-red-700"}`}>Additional Notes</h3>
                {booking.cancellationReason && (
                  <p className={`text-sm ${isDarkMode ? "text-red-200" : "text-red-700"}`}>
                    Cancellation Reason: {booking.cancellationReason}
                  </p>
                )}
                {booking.updatedAt && (
                  <p className={`mt-1 text-xs ${isDarkMode ? "text-red-200/80" : "text-red-700/90"}`}>
                    Last Updated: {formatDateTime(booking.updatedAt)}
                  </p>
                )}
              </section>
            )}
          </div>

          <div className={`sticky bottom-0 border-t px-6 py-4 ${isDarkMode ? "border-gray-700 bg-gray-900/95" : "border-gray-200 bg-white/95"}`}>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`rounded-lg px-5 py-2 text-sm font-semibold ${isDarkMode ? "bg-gray-700 text-gray-100 hover:bg-gray-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
