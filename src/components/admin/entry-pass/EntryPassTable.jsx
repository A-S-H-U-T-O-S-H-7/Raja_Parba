// components/admin/entry-pass-management/EntryPassTable.jsx
"use client";

import { Eye, CheckCircle, XCircle, UserCheck, Loader2, Calendar, Mail, Phone, Users, Ticket, ImageOff } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";
import { format } from "date-fns";

const formatDate = (value) => {
  if (!value) return "N/A";
  try {
    const dateObj = value?.toDate?.() || new Date(value);
    if (Number.isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, "dd/MM/yyyy, hh:mm:ss a");
  } catch {
    return "N/A";
  }
};

const formatSimpleDate = (value) => {
  if (!value) return "N/A";
  try {
    const dateObj = value?.toDate?.() || new Date(value);
    if (Number.isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, "dd/MM/yyyy");
  } catch {
    return "N/A";
  }
};

const formatCurrency = (amount) => {
  const value = Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
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
  const isDark = isDarkMode;

  const getStatusColors = (status) => {
    if (isDark) {
      switch(status) {
        case 'confirmed': return 'bg-green-900/60 text-green-200 border border-green-700';
        case 'pending': return 'bg-yellow-900/60 text-yellow-200 border border-yellow-700';
        case 'cancelled': return 'bg-red-900/60 text-red-200 border border-red-700';
        default: return 'bg-gray-700 text-gray-200 border border-gray-600';
      }
    }
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  // Table headers configuration
  const tableHeaders = [
    { label: "S.No", width: "70px" },
    { label: "Entry ID", width: "120px" },
    { label: "Image", width: "80px" },
    { label: "Applicant Information", width: "200px" },
    { label: "Contact Details", width: "200px" },
    { label: "Persons", width: "80px" },
    { label: "Amount", width: "90px" },
    { label: "Booking Date", width: "150px" },
    { label: "Status", width: "120px" },
    { label: "Actions", width: "180px" }
  ];

  const headerStyle = `px-4 py-3 text-center text-sm font-bold border-r ${
    isDark 
      ? "text-blue-100 border-indigo-700/50 bg-gray-900" 
      : "text-indigo-900 border-indigo-200/70 bg-gray-50"
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
            Loading entry passes...
          </p>
        </div>
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className={`rounded-2xl border-2 p-12 text-center ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Ticket className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No Entry Pass Records Found
        </h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          There are no entry pass records to display at the moment.
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
        <table className="w-full min-w-max" style={{ minWidth: "1450px" }}>
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
              const details = booking.delegateDetails || {};
              const event = booking.eventDetails || {};
              const personsFromField = Number(event.numberOfPersons || 0);
              const membersCount = event.members?.length || 0;
              const persons = personsFromField
                ? (membersCount === personsFromField ? personsFromField + 1 : personsFromField)
                : (membersCount + 1);
              
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
                  } ${rowBgColor} ${booking.participated ? isDark ? "bg-green-900/20" : "bg-green-50/50" : ""}`}
                >
                  {/* S.No */}
                  <td className={`px-4 py-4 text-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <span className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {serialNo.toString().padStart(2, '0')}
                    </span>
                  </td>

                  {/* Entry ID */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex items-center">
                      <Ticket className={`w-4 h-4 mr-2 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {booking.id?.slice(-8) || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Image */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    {booking.imageUrl ? (
                      <img
                        src={booking.imageUrl}
                        alt={`${details.name || "Applicant"} photo`}
                        className="h-12 w-12 rounded-lg border border-indigo-200 object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
                          isDark
                            ? "border-gray-600 bg-gray-700 text-gray-300"
                            : "border-gray-300 bg-gray-100 text-gray-500"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1 text-[10px] font-medium">
                          <ImageOff className="h-3.5 w-3.5" />
                          <span>No image</span>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Applicant Information */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col space-y-1">
                      <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                        {details.name || "N/A"}
                      </span>
                      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {details.city || "N/A"}, {details.state || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Contact Details */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className={`w-3 h-3 mr-1 flex-shrink-0 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                          {details.mobile || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-">
                        <Mail className={`w-3 h-3 mr-1 flex-shrink-0 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={`truncate max-w-[180px] ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {details.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Persons */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex items-center">
                      <Users className={`w-4 h-4 mr-2 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {persons}
                      </span>
                    </div>
                  </td>

                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {formatCurrency(
                        booking.paidAmount ??
                        booking.totalAmount ??
                        booking.payment?.amount ??
                        0
                      )}
                    </span>
                  </td>

                  

                  {/* Booking Date */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm">
                        <Calendar className={`w-3 h-3 mr-1 ${
                          isDark ? "text-indigo-400" : "text-indigo-600"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                          {formatSimpleDate(booking.createdAt)}
                        </span>
                      </div>
                      <span className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className={`px-4 py-4 border-r ${
                    isDark ? "border-gray-700" : "border-gray-300"
                  }`}>
                    <div className="flex flex-col items-start space-y-2">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md ${getStatusColors(booking.status)}`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                      </span>
                      {booking.participated && (
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

                      {canManageBookings && booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => onConfirm(booking)}
                            disabled={isUpdating}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-green-900/60 hover:bg-green-800/60 text-green-300 border border-green-700' 
                                : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                            }`}
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onCancel(booking)}
                            disabled={isUpdating}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-red-900/60 hover:bg-red-800/60 text-red-300 border border-red-700' 
                                : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                            }`}
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {canManageBookings && booking.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => onParticipation(booking)}
                            disabled={isUpdating || booking.participated}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              booking.participated
                                ? isDark
                                  ? 'bg-green-900/40 text-green-300 border border-green-700 cursor-not-allowed opacity-70'
                                  : 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed opacity-70'
                                : isDark
                                  ? 'bg-blue-900/60 hover:bg-blue-800/60 text-blue-300 border border-blue-700'
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300'
                            }`}
                            title={booking.participated ? "Participation done" : "Mark participation"}
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onCancel(booking)}
                            disabled={isUpdating}
                            className={`p-2 rounded-lg transition-all hover:scale-105 ${
                              isDark 
                                ? 'bg-red-900/60 hover:bg-red-800/60 text-red-300 border border-red-700' 
                                : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                            }`}
                            title="Cancel"
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
