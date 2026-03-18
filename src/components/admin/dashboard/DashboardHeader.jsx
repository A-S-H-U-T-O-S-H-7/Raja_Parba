// components/admin/dashboard/DashboardHeader.jsx
"use client";

import { Wallet } from "lucide-react";
import useThemeStore from "@/lib/stores/useThemeStore";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function DashboardHeader({ 
  totalRevenue, 
  stallRevenue, 
  showRevenue, 
  entryPassRevenue,
  donationRevenue 
}) {
  const { isDarkMode } = useThemeStore();

  return (
    <section
      className={`rounded-2xl  border p-5 sm:p-6 ${
        isDarkMode
          ? "border-gray-700 bg-gray-800/90"
          : "border-indigo-100 bg-gradient-to-br from-indigo-50 via-blue-50 to-white"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Dashboard Snapshot
          </h2>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Registrations, bookings, users and revenue in one place.
          </p>
        </div>

        <div
          className={`inline-flex w-full max-w-xs items-center justify-between rounded-xl border px-4 py-3 lg:w-auto ${
            isDarkMode 
              ? "border-gray-600 bg-gray-700/50" 
              : "border-indigo-200 bg-white/80"
          }`}
        >
          <div>
            <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
              Total Revenue
            </p>
            <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <Wallet className={`h-7 w-7 ${isDarkMode ? "text-indigo-300" : "text-indigo-500"}`} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <RevenueCard 
          label="Stall Revenue" 
          value={stallRevenue}
          color={isDarkMode ? "text-emerald-300" : "text-emerald-700"}
        />
        <RevenueCard 
          label="Show Revenue" 
          value={showRevenue}
          color={isDarkMode ? "text-blue-300" : "text-blue-700"}
        />
        <RevenueCard 
          label="Entry Pass Revenue" 
          value={entryPassRevenue}
          color={isDarkMode ? "text-lime-300" : "text-lime-700"}
        />
        <RevenueCard 
          label="Donation Revenue" 
          value={donationRevenue}
          color={isDarkMode ? "text-purple-300" : "text-purple-700"}
        />
      </div>
    </section>
  );
}

function RevenueCard({ label, value, color }) {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={`rounded-xl border p-3 ${
      isDarkMode 
        ? "border-gray-700 bg-gray-700/30" 
        : "border-indigo-100 bg-white/80"
    }`}>
      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className={`text-lg font-semibold ${color}`}>{formatCurrency(value)}</p>
    </div>
  );
}
