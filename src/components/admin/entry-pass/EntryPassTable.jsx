"use client";

import { Eye, CheckCircle, XCircle, UserCheck, Loader2 } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";
import { format } from "date-fns";

const formatDate = (value) => {
  if (!value) return "N/A";
  try {
    const dateObj = value?.toDate?.() || new Date(value);
    if (Number.isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, "dd MMM yyyy");
  } catch {
    return "N/A";
  }
};

export default function EntryPassTable({
  bookings,
  loading,
  isUpdating,
  currentPage,
  bookingsPerPage,
  onViewDetails,
  onConfirm,
  onCancel,
  onParticipation,
  canManageBookings,
}) {
  const { isDarkMode } = useThemeStore();

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: isDarkMode
        ? "bg-green-900/30 text-green-300 border-green-700"
        : "bg-green-50 text-green-700 border-green-200",
      pending: isDarkMode
        ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
        : "bg-yellow-50 text-yellow-700 border-yellow-200",
      cancelled: isDarkMode
        ? "bg-red-900/30 text-red-300 border-red-700"
        : "bg-red-50 text-red-700 border-red-200",
    };
    const cls = styles[status] || styles.pending;
    return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{status || "pending"}</span>;
  };

  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className={`rounded-xl border p-10 text-center ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-700"}`}>
        No entry pass records found.
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? "bg-gray-700/40" : "bg-gray-50/70"}>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">S.No</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Entry ID</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Applicant</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Contact</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Persons</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
            {bookings.map((booking, index) => {
              const details = booking.delegateDetails || {};
              const event = booking.eventDetails || {};
              const persons = Number(event.numberOfPersons || event.members?.length || 0);
              return (
                <tr
                  key={booking.id}
                  className={`transition-colors ${
                    booking.participated
                      ? isDarkMode
                        ? "bg-green-900/20 hover:bg-green-800/30"
                        : "bg-green-50 hover:bg-green-100/70"
                      : isDarkMode
                      ? "hover:bg-gray-700/40"
                      : "hover:bg-gray-50/70"
                  }`}
                >
                  <td className={`px-3 py-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {((currentPage - 1) * bookingsPerPage + index + 1).toString().padStart(2, "0")}
                  </td>
                  <td className={`px-3 py-3 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{booking.id}</td>
                  <td className={`px-3 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    <div className="font-medium">{details.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{details.city || "N/A"}, {details.state || "N/A"}</div>
                  </td>
                  <td className={`px-3 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    <div>{details.mobile || "N/A"}</div>
                    <div className="text-xs text-gray-500">{details.email || "N/A"}</div>
                  </td>
                  <td className={`px-3 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{persons}</td>
                  <td className={`px-3 py-3 text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{formatDate(booking.createdAt)}</td>
                  <td className="px-3 py-3">
                    <div className="space-y-1">
                      {getStatusBadge(booking.status)}
                      {booking.participated && <p className="text-xs font-medium text-green-600">Participated</p>}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewDetails(booking)}
                        className={`rounded-lg p-2 transition ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {canManageBookings && booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => onConfirm(booking)}
                            className={`rounded-lg p-2 transition ${isDarkMode ? "bg-green-800/40 text-green-300 hover:bg-green-700/60" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                            title="Confirm"
                            disabled={isUpdating}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onCancel(booking)}
                            className={`rounded-lg p-2 transition ${isDarkMode ? "bg-red-800/40 text-red-300 hover:bg-red-700/60" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                            title="Cancel"
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {canManageBookings && booking.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => onParticipation(booking)}
                            className={`rounded-lg p-2 transition ${
                              booking.participated
                                ? isDarkMode
                                  ? "bg-green-800/40 text-green-300"
                                  : "bg-green-100 text-green-700"
                                : isDarkMode
                                ? "bg-blue-800/40 text-blue-300 hover:bg-blue-700/60"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                            title={booking.participated ? "Participation done" : "Mark participation"}
                            disabled={isUpdating}
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onCancel(booking)}
                            className={`rounded-lg p-2 transition ${isDarkMode ? "bg-red-800/40 text-red-300 hover:bg-red-700/60" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                            title="Cancel"
                            disabled={isUpdating}
                          >
                            <XCircle className="h-4 w-4" />
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

      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </div>
        </div>
      )}
    </div>
  );
}
