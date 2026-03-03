// components/admin/show-bookings/ShowBookingTable.jsx
"use client";

import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  Ticket,
  Mail,
  Phone,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function ShowBookingTable({
  bookings,
  loading,
  isUpdating,
  currentPage = 1,
  bookingsPerPage = 10,
  canManageBookings = true,
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
    if (!amount || Number.isNaN(Number(amount))) return "INR 0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      const date = dateValue?.toDate?.() || new Date(dateValue);
      if (Number.isNaN(date.getTime())) return "N/A";
      return format(date, "MMM dd, yyyy HH:mm");
    } catch {
      return "N/A";
    }
  };

  const formatShowDate = (value, timeText = "") => {
    if (!value) return "N/A";
    try {
      const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : new Date(value));
      if (Number.isNaN(date.getTime())) return "N/A";
      return `${format(date, "MMM dd, yyyy")}${timeText ? ` (${timeText})` : ""}`;
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: {
        icon: CheckCircle,
        bg: isDarkMode ? "bg-green-900/30 text-green-300 border-green-600" : "bg-green-50 text-green-700 border-green-200",
        label: "Confirmed"
      },
      pending: {
        icon: Clock,
        bg: isDarkMode ? "bg-yellow-900/30 text-yellow-300 border-yellow-600" : "bg-yellow-50 text-yellow-700 border-yellow-200",
        label: "Pending"
      },
      cancelled: {
        icon: XCircle,
        bg: isDarkMode ? "bg-red-900/30 text-red-300 border-red-600" : "bg-red-50 text-red-700 border-red-200",
        label: "Cancelled"
      },
      "cancellation-requested": {
        icon: AlertTriangle,
        bg: isDarkMode ? "bg-orange-900/30 text-orange-300 border-orange-600" : "bg-orange-50 text-orange-700 border-orange-200",
        label: "Cancellation Requested"
      }
    };

    const { icon: Icon, bg, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${bg}`}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </span>
    );
  };

  const getSeatCategory = (seatId) => {
    if (!seatId) return "Standard";
    const seatStr = String(seatId);
    if (seatStr.startsWith("A") || seatStr.startsWith("B")) return "VIP";
    if (seatStr.startsWith("C")) return "Premium";
    return "Standard";
  };

  const getSeatStyle = (category) => {
    if (category === "VIP") {
      return isDarkMode
        ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
        : "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
    if (category === "Premium") {
      return isDarkMode
        ? "bg-blue-900/50 text-blue-300 border-blue-700"
        : "bg-blue-50 text-blue-700 border-blue-200";
    }
    return isDarkMode
      ? "bg-gray-600 text-gray-300 border-gray-700"
      : "bg-gray-100 text-gray-700 border-gray-300";
  };

  const renderActionButtons = (booking) => {
    const baseClass = "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50";
    const status = String(booking?.status || "pending").toLowerCase().trim();
    const isCancelled = status === "cancelled";
    const isCancellationRequested = status === "cancellation-requested";
    const isPending = status === "pending";
    const isConfirmed = status === "confirmed";

    return (
      <div className="flex min-w-[220px] flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onViewDetails(booking)}
          className={`${baseClass} ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>

        {canManageBookings && isPending && (
          <>
            <button
              onClick={() => onConfirm(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                isDarkMode
                  ? "border-green-600 bg-green-700 text-green-100 hover:bg-green-600"
                  : "border-green-600 bg-green-600 text-white hover:bg-green-700"
              }`}
              title="Confirm Booking"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Confirm</span>
            </button>
          </>
        )}

        {canManageBookings && isConfirmed && (
          <>
            <button
              onClick={() => onParticipation(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                booking.participated
                  ? isDarkMode
                    ? "cursor-default border-green-600 bg-green-700 text-green-100"
                    : "cursor-default border-green-600 bg-green-600 text-white"
                  : isDarkMode
                  ? "border-blue-600 bg-blue-700 text-blue-100 hover:bg-blue-600"
                  : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
              }`}
              title={booking.participated ? "Already Participated" : "Mark Participation"}
            >
              <UserCheck className="h-4 w-4" />
              <span>Participate</span>
            </button>
          </>
        )}

        {canManageBookings && isCancellationRequested && (
          <>
            <button
              onClick={() => onApproveCancellation(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                isDarkMode
                  ? "border-green-600 bg-green-700 text-green-100 hover:bg-green-600"
                  : "border-green-600 bg-green-600 text-white hover:bg-green-700"
              }`}
              title="Approve Cancellation"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => onRejectCancellation(booking)}
              disabled={isUpdating}
              className={`${baseClass} ${
                isDarkMode
                  ? "border-red-600 bg-red-700 text-red-100 hover:bg-red-600"
                  : "border-red-600 bg-red-600 text-white hover:bg-red-700"
              }`}
              title="Reject Cancellation"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </button>
          </>
        )}

        {canManageBookings && !isCancelled && !isCancellationRequested && (
          <button
            onClick={() => onCancel(booking)}
            disabled={isUpdating}
            className={`${baseClass} ${
              isDarkMode
                ? "border-red-600 bg-red-700 text-red-100 hover:bg-red-600"
                : "border-red-600 bg-red-600 text-white hover:bg-red-700"
            }`}
            title="Cancel Booking"
          >
            <XCircle className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className={`rounded-xl border p-12 text-center ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <Ticket className={`mx-auto mb-4 h-16 w-16 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
        <h3 className={`mb-2 text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>No Show Bookings Found</h3>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          There are no show bookings to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? "bg-gray-700/50" : "bg-gray-50/50"}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">S.No</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Booking</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Show Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
            {bookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`transition-colors ${
                  booking.participated
                    ? isDarkMode
                      ? "border-l-4 border-green-500 bg-green-900/20 hover:bg-green-800/30"
                      : "border-l-4 border-green-400 bg-green-50 hover:bg-green-100/70"
                    : isDarkMode
                    ? "hover:bg-gray-700/50"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {((currentPage - 1) * bookingsPerPage + index + 1).toString().padStart(2, "0")}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  <div className="space-y-1">
                    <div className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {booking.bookingId || booking.id}
                    </div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{formatDateTime(booking.createdAt)}</div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{booking.userDetails?.name || "N/A"}</div>
                    <div className={`flex items-center text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <Mail className="mr-1 h-3 w-3" />
                      {booking.userDetails?.email || "N/A"}
                    </div>
                    <div className={`flex items-center text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <Phone className="mr-1 h-3 w-3" />
                      {booking.userDetails?.phone || "N/A"}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {formatShowDate(booking.showDetails?.date, booking.showDetails?.time)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {booking.showDetails?.selectedSeats?.slice(0, 3).map((seat, idx) => {
                        const seatDisplay = typeof seat === "object" ? seat.id || seat.seatId || String(seat) : String(seat);
                        const category = getSeatCategory(seatDisplay);
                        return (
                          <span key={idx} className={`inline-block rounded-md border px-2 py-1 text-xs font-medium ${getSeatStyle(category)}`}>
                            {seatDisplay}
                          </span>
                        );
                      })}
                      {booking.showDetails?.selectedSeats?.length > 3 && (
                        <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                          +{booking.showDetails.selectedSeats.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  <div className="space-y-1">
                    <div className={`text-sm font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                      {formatCurrency(booking.showDetails?.totalAmount || booking.showDetails?.totalPrice || booking.payment?.amount || 0)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {booking.showDetails?.selectedSeats?.length || 0} seats
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  <div className="space-y-2">
                    {getStatusBadge(booking.status)}
                    {booking.participated && <span className="block text-xs text-green-600 dark:text-green-400">Participated</span>}
                    {booking.cancellationReason && (
                      <div className={`max-w-32 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <span className="font-medium">Reason:</span> {booking.cancellationReason}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">{renderActionButtons(booking)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <div className={`flex items-center gap-3 rounded-xl border px-6 py-4 shadow-2xl ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
