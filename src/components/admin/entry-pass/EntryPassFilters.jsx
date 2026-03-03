"use client";

import { Search, Filter, Calendar } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function EntryPassFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  participationFilter,
  onParticipationChange,
  dateFilter,
  onDateChange,
  loading,
}) {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={`rounded-xl border p-4 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by ID, name, email, mobile"
              className={`w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none transition ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
              }`}
            />
          </div>
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
            }`}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <select
            value={participationFilter}
            onChange={(e) => onParticipationChange(e.target.value)}
            className={`w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
            }`}
          >
            <option value="all">All Participation</option>
            <option value="yes">Participated</option>
            <option value="no">Not Participated</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Calendar className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <select
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className={`w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
            }`}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        <div className="flex items-center">
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {loading ? "Refreshing data..." : "Filters apply automatically"}
          </span>
        </div>
      </div>
    </div>
  );
}
