"use client";

import { X, User, Mail, Phone, MapPin, Users } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";
import { format } from "date-fns";

const formatDate = (value) => {
  if (!value) return "N/A";
  try {
    const dateObj = value?.toDate?.() || new Date(value);
    if (Number.isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, "dd MMM yyyy, HH:mm");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className={`sticky top-0 z-10 border-b p-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Entry Pass Details</h3>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>ID: {booking.id}</p>
            </div>
            <button
              onClick={onClose}
              className={`rounded-lg p-2 transition ${
                isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className={`rounded-lg border p-3 ${isDarkMode ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
              <p className={`mb-2 text-xs font-semibold uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Contact</p>
              <div className="space-y-2 text-sm">
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}><User className="h-4 w-4" />{details.name || "N/A"}</p>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}><Mail className="h-4 w-4" />{details.email || "N/A"}</p>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"} flex items-center gap-2`}><Phone className="h-4 w-4" />{details.mobile || "N/A"}</p>
              </div>
            </div>

            <div className={`rounded-lg border p-3 ${isDarkMode ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
              <p className={`mb-2 text-xs font-semibold uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Address</p>
              <div className="space-y-2 text-sm">
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"} flex items-start gap-2`}>
                  <MapPin className="mt-0.5 h-4 w-4" />
                  <span>
                    {details.address || "N/A"}
                    <br />
                    {[details.city, details.state, details.country, details.pincode].filter(Boolean).join(", ")}
                  </span>
                </p>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Aadhar: {details.aadharno || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-3 ${isDarkMode ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
            <p className={`mb-2 text-xs font-semibold uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Booking Info</p>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
              <p className={isDarkMode ? "text-white" : "text-gray-900"}>Status: <span className="font-semibold">{booking.status || "N/A"}</span></p>
              <p className={isDarkMode ? "text-white" : "text-gray-900"}>Persons: <span className="font-semibold">{totalPersons}</span></p>
              <p className={isDarkMode ? "text-white" : "text-gray-900"}>Created: <span className="font-semibold">{formatDate(booking.createdAt)}</span></p>
              <p className={isDarkMode ? "text-white" : "text-gray-900"}>Participated: <span className="font-semibold">{booking.participated ? "Yes" : "No"}</span></p>
              <p className={isDarkMode ? "text-white" : "text-gray-900"}>Participated At: <span className="font-semibold">{formatDate(booking.participatedAt)}</span></p>
            </div>
          </div>

          <div className={`rounded-lg border p-3 ${isDarkMode ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
            <p className={`mb-2 text-xs font-semibold uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Members</p>
            {members.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No member details submitted.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      <th className="px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">Name</th>
                      <th className="px-2 py-2 text-left">Gender</th>
                      <th className="px-2 py-2 text-left">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr key={`${member.name || "member"}-${index}`} className={`border-t ${isDarkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-800"}`}>
                        <td className="px-2 py-2">{index + 1}</td>
                        <td className="px-2 py-2">{member.name || "N/A"}</td>
                        <td className="px-2 py-2">{member.gender || "N/A"}</td>
                        <td className="px-2 py-2">{member.age || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {details.fileInfo?.imageUrl && (
            <div className={`rounded-lg border p-3 ${isDarkMode ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
              <p className={`mb-2 text-xs font-semibold uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Photo</p>
              <img
                src={details.fileInfo.imageUrl}
                alt="Entry pass applicant"
                className="h-28 w-28 rounded-lg border border-gray-300 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
