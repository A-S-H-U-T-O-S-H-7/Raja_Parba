// components/admin/dashboard/RecentBookingsTable.jsx
"use client";

import Link from "next/link";
import useThemeStore from "@/lib/stores/useThemeStore";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const isRevenueStatus = (status) => {
  const value = String(status || "").toLowerCase();
  return ["confirmed", "completed", "paid", "success"].includes(value);
};

const formatCreatedAt = (value) => {
  if (!value) return "N/A";
  if (value instanceof Date) return value.toLocaleString("en-IN");
  if (typeof value?.toDate === "function") return value.toDate().toLocaleString("en-IN");
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "N/A" : parsed.toLocaleString("en-IN");
};

export default function RecentBookingsTable({ bookings }) {
  const { isDarkMode } = useThemeStore();
  const rows = Array.isArray(bookings) ? bookings : [];

  const getStatusColors = (status) => {
    const isSuccess = isRevenueStatus(status);
    if (isDarkMode) {
      return isSuccess
        ? "bg-green-900/60 text-green-200 border border-green-700"
        : "bg-amber-900/60 text-amber-200 border border-amber-700";
    }
    return isSuccess
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-amber-100 text-amber-700 border border-amber-300";
  };

  const getTypeColors = (type) => {
    if (isDarkMode) {
      switch(type) {
        case "Stall": return "bg-emerald-900/60 text-emerald-200 border border-emerald-700";
        case "Show": return "bg-blue-900/60 text-blue-200 border border-blue-700";
        case "Entry Pass": return "bg-lime-900/60 text-lime-200 border border-lime-700";
        default: return "bg-gray-800 text-gray-200 border border-gray-700";
      }
    }
    switch(type) {
      case "Stall": return "bg-emerald-100 text-emerald-700 border border-emerald-300";
      case "Show": return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Entry Pass": return "bg-lime-100 text-lime-700 border border-lime-300";
      default: return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  return (
    <section
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <div className={`p-5 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Recent Bookings
          </h3>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/bookings/stalls"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isDarkMode 
                  ? "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700" 
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300"
              }`}
            >
              Stall
            </Link>
            <Link
              href="/admin/bookings/shows"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isDarkMode 
                  ? "bg-blue-900/60 text-blue-200 hover:bg-blue-800/60 border border-blue-700" 
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
              }`}
            >
              Show
            </Link>
            <Link
              href="/admin/entry-pass-management"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isDarkMode 
                  ? "bg-lime-900/60 text-lime-200 hover:bg-lime-800/60 border border-lime-700" 
                  : "bg-lime-100 text-lime-700 hover:bg-lime-200 border border-lime-300"
              }`}
            >
              Entry Pass
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y ${
            isDarkMode ? "divide-gray-700" : "divide-gray-200"
          }`}
        >
          <thead className={isDarkMode ? "bg-gray-900" : "bg-gray-50"}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                isDarkMode ? "text-gray-300 border-gray-700" : "text-gray-500 border-gray-200"
              }`}>
                S.No
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                isDarkMode ? "text-gray-300 border-gray-700" : "text-gray-500 border-gray-200"
              }`}>
                Type
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                isDarkMode ? "text-gray-300 border-gray-700" : "text-gray-500 border-gray-200"
              }`}>
                Name
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                isDarkMode ? "text-gray-300 border-gray-700" : "text-gray-500 border-gray-200"
              }`}>
                Email
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                isDarkMode ? "text-gray-300 border-gray-700" : "text-gray-500 border-gray-200"
              }`}>
                Amount
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r ${
                isDarkMode ? "text-gray-300 border-gray-700" : "text-gray-500 border-gray-200"
              }`}>
                Status
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}>
                Created
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? "divide-gray-700" : "divide-gray-200"
          }`}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className={`px-4 py-8 text-center text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No recent bookings found.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr 
                  key={row?.id ? `${row.type}-${row.id}` : `${row.type || "booking"}-${index}`} 
                  className={`transition-colors ${
                    isDarkMode 
                      ? "hover:bg-gray-700" 
                      : "hover:bg-indigo-50"
                  }`}
                >
                  <td className={`px-4 py-3 text-sm border-r ${
                    isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className={`px-4 py-3 text-sm border-r ${
                    isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
                  }`}>
                    <span
                      className={`inline-block rounded-md  px-2 py-1 text-xs font-semibold ${getTypeColors(row.type)}`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium border-r ${
                    isDarkMode ? "border-gray-700 text-white" : "border-gray-200 text-gray-900"
                  }`}>
                    {row.name}
                  </td>
                  <td className={`px-4 py-3 text-sm border-r ${
                    isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
                  }`}>
                    {row.email}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold border-r ${
                    isDarkMode ? "border-gray-700 text-gray-100" : "border-gray-200 text-gray-900"
                  }`}>
                    {formatCurrency(row.amount)}
                  </td>
                  <td className={`px-4 py-3 text-sm border-r ${
                    isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
                  }`}>
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs font-semibold capitalize ${getStatusColors(row.status)}`}
                    >
                      {String(row.status || "pending").replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {formatCreatedAt(row.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
