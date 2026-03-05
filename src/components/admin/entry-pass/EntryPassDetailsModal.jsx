"use client";

import { X, User, Mail, Phone, MapPin, Users, Calendar } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";
import { format } from "date-fns";

const formatDate = (value) => {
  if (!value) return "N/A";
  try {
    const dateObj = value?.toDate?.() || new Date(value);
    if (Number.isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, "dd MMM yyyy, hh:mm a");
  } catch {
    return "N/A";
  }
};

export default function EntryPassDetailsModal({ isOpen, booking, onClose }) {
  const { isDarkMode } = useThemeStore();

  if (!isOpen || !booking) return null;

  const details = booking.delegateDetails || {};
  const event = booking.eventDetails || {};
  const members = Array.isArray(event.members) ? event.members : [];
  const personsFromField = Number(event.numberOfPersons || 0);
  const totalPersons = personsFromField
    ? (members.length === personsFromField ? personsFromField + 1 : personsFromField)
    : (members.length + 1);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: isDarkMode ? "text-green-400" : "text-green-600",
      pending: isDarkMode ? "text-yellow-400" : "text-yellow-600",
      cancelled: isDarkMode ? "text-red-400" : "text-red-600",
    };
    return colors[status] || (isDarkMode ? "text-gray-400" : "text-gray-600");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl border shadow-xl overflow-hidden ${
          isDarkMode 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" 
            : "bg-gradient-to-br from-white to-indigo-50/50 border-indigo-100"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? "border-gray-700" : "border-indigo-100"
        }`}>
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Entry Pass Details
            </h3>
            <p className={`text-sm mt-1 font-mono ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {booking.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${
              isDarkMode 
                ? "hover:bg-gray-700 text-gray-400" 
                : "hover:bg-indigo-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Status
            </span>
            <span className={`font-semibold capitalize ${getStatusColor(booking.status)}`}>
              {booking.status || "pending"}
            </span>
          </div>

          {/* Contact & Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            }`}>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}>
                <User className="w-4 h-4" />
                Contact
              </h4>
              <div className="space-y-3">
                <p className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <span className="font-medium">Name:</span> {details.name || "N/A"}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Email:</span> {details.email || "N/A"}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Phone:</span> {details.mobile || "N/A"}
                </p>
              </div>
            </div>

            <div className={`p-5 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            }`}>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}>
                <MapPin className="w-4 h-4" />
                Address
              </h4>
              <div className="space-y-3">
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {details.address || "N/A"}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {[details.city, details.state, details.pincode].filter(Boolean).join(", ") || "N/A"}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Aadhar:</span> {details.aadharno || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Info */}
          <div className={`p-5 rounded-xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white/80"
          }`}>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
              isDarkMode ? "text-indigo-400" : "text-indigo-600"
            }`}>
              <Calendar className="w-4 h-4" />
              Booking Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Persons</p>
                <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{totalPersons}</p>
              </div>
              <div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Created</p>
                <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {formatDate(booking.createdAt)}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Participated</p>
                <p className={`text-sm font-medium ${booking.participated ? "text-green-500" : "text-yellow-500"}`}>
                  {booking.participated ? "Yes" : "No"}
                </p>
              </div>
              {booking.participatedAt && (
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Participated At</p>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formatDate(booking.participatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Members List */}
          {members.length > 0 && (
            <div className={`p-5 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            }`}>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}>
                <Users className="w-4 h-4" />
                Members ({members.length})
              </h4>
              <div className="space-y-2">
                {members.map((member, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}>
                    <span className={`text-sm font-medium ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                      #{idx + 1}
                    </span>
                    <span className={`text-sm flex-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {member.name || "N/A"}
                    </span>
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {member.gender || "N/A"}, {member.age || "N/A"} yrs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo */}
          {details.fileInfo?.imageUrl && (
            <div className={`p-5 rounded-xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/80"
            }`}>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}>
                Photo
              </h4>
              <img
                src={details.fileInfo.imageUrl}
                alt="Applicant"
                className="w-24 h-24 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
