"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Crown,
  Gem,
  Loader2,
  Medal,
  Mic2,
  Sparkles,
  Store,
  Ticket,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import useThemeStore from "@/lib/stores/useThemeStore";

const toDateSafe = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseAmount = (record) => {
  const amountValue =
    record?.payment?.amount ??
    record?.totalAmount ??
    record?.amount ??
    record?.total ??
    record?.paymentDetails?.amount ??
    0;
  const parsed = Number(amountValue);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isRevenueStatus = (status) => {
  const value = String(status || "").toLowerCase();
  return ["confirmed", "completed", "paid", "success"].includes(value);
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const getPersonName = (record) =>
  record?.delegateDetails?.name ||
  record?.userDetails?.name ||
  record?.customerDetails?.name ||
  record?.vendorDetails?.ownerName ||
  record?.vendorDetails?.name ||
  record?.name ||
  "N/A";

const getPersonEmail = (record) =>
  record?.delegateDetails?.email ||
  record?.userDetails?.email ||
  record?.customerDetails?.email ||
  record?.vendorDetails?.email ||
  record?.email ||
  "N/A";

const cardAccent = {
  sponsor: "from-rose-500 to-red-600",
  performer: "from-fuchsia-500 to-pink-600",
  queen: "from-purple-500 to-violet-600",
  kumari: "from-orange-500 to-amber-600",
  award: "from-yellow-500 to-orange-600",
  drawing: "from-cyan-500 to-sky-600",
  stall: "from-emerald-500 to-teal-600",
  show: "from-indigo-500 to-blue-600",
  entry: "from-lime-500 to-green-600",
  users: "from-slate-600 to-gray-700",
};

export default function OverviewStats() {
  const { isDarkMode } = useThemeStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({
    sponsor: 0,
    performer: 0,
    queen: 0,
    kumari: 0,
    award: 0,
    drawing: 0,
    stallBookings: 0,
    showBookings: 0,
    entryPass: 0,
    users: 0,
    stallRevenue: 0,
    showRevenue: 0,
    donationRevenue: 0,
    totalRevenue: 0,
    recentBookings: [],
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        sponsorSnap,
        performerSnap,
        queenSnap,
        kumariSnap,
        awardSnap,
        drawingSnap,
        stallSnap,
        showSnap,
        delegateSnap,
        usersSnap,
        donationSnap,
      ] = await Promise.all([
        getDocs(collection(db, "sponsors")),
        getDocs(collection(db, "performers")),
        getDocs(collection(db, "raja_queen_applications")),
        getDocs(collection(db, "raja_kumari_applications")),
        getDocs(collection(db, "award_applications")),
        getDocs(collection(db, "drawing_applications")),
        getDocs(collection(db, "stallBookings")),
        getDocs(collection(db, "showBookings")),
        getDocs(collection(db, "delegateBookings")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "donations")),
      ]);

      let stallRevenue = 0;
      let showRevenue = 0;
      let donationRevenue = 0;
      const recentBookings = [];

      stallSnap.forEach((row) => {
        const data = row.data();
        if (isRevenueStatus(data.status)) {
          stallRevenue += parseAmount(data);
        }

        recentBookings.push({
          id: row.id,
          type: "Stall",
          name: getPersonName(data),
          email: getPersonEmail(data),
          status: data.status || "pending",
          amount: parseAmount(data),
          createdAt: toDateSafe(data.createdAt),
        });
      });

      showSnap.forEach((row) => {
        const data = row.data();
        if (isRevenueStatus(data.status)) {
          showRevenue += parseAmount(data);
        }

        recentBookings.push({
          id: row.id,
          type: "Show",
          name: getPersonName(data),
          email: getPersonEmail(data),
          status: data.status || "pending",
          amount: parseAmount(data),
          createdAt: toDateSafe(data.bookingDate || data.createdAt),
        });
      });

      let entryPass = 0;
      delegateSnap.forEach((row) => {
        const data = row.data();
        if (data.category === "free_pass") {
          entryPass += 1;
          recentBookings.push({
            id: row.id,
            type: "Entry Pass",
            name: getPersonName(data),
            email: getPersonEmail(data),
            status: data.status || "pending",
            amount: 0,
            createdAt: toDateSafe(data.createdAt),
          });
        }
      });

      donationSnap.forEach((row) => {
        const data = row.data();
        if (isRevenueStatus(data.status)) {
          donationRevenue += parseAmount(data);
        }
      });

      recentBookings.sort((a, b) => {
        const aTime = a.createdAt ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt ? b.createdAt.getTime() : 0;
        return bTime - aTime;
      });

      const totalRevenue = stallRevenue + showRevenue + donationRevenue;

      setMetrics({
        sponsor: sponsorSnap.size,
        performer: performerSnap.size,
        queen: queenSnap.size,
        kumari: kumariSnap.size,
        award: awardSnap.size,
        drawing: drawingSnap.size,
        stallBookings: stallSnap.size,
        showBookings: showSnap.size,
        entryPass,
        users: usersSnap.size,
        stallRevenue,
        showRevenue,
        donationRevenue,
        totalRevenue,
        recentBookings: recentBookings.slice(0, 10),
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Unable to load dashboard stats right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const registrationCards = useMemo(
    () => [
      { key: "sponsor", title: "Sponsors", value: metrics.sponsor, icon: Sparkles },
      { key: "performer", title: "Performers", value: metrics.performer, icon: Mic2 },
      { key: "queen", title: "Raja Queen", value: metrics.queen, icon: Crown },
      { key: "kumari", title: "Raja Kumari", value: metrics.kumari, icon: Gem },
      { key: "award", title: "Award", value: metrics.award, icon: Trophy },
      { key: "drawing", title: "Drawing", value: metrics.drawing, icon: Medal },
      { key: "stall", title: "Stall Bookings", value: metrics.stallBookings, icon: Store },
      { key: "show", title: "Show Bookings", value: metrics.showBookings, icon: CalendarDays },
      { key: "entry", title: "Entry Pass", value: metrics.entryPass, icon: Ticket },
      { key: "users", title: "Users", value: metrics.users, icon: Users },
    ],
    [metrics]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isDarkMode
              ? "border-red-900/70 bg-red-950/40 text-red-200"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {error}
        </div>
      ) : null}

      <section
        className={`rounded-2xl border p-5 sm:p-6 ${
          isDarkMode
            ? "border-red-900/50 bg-gradient-to-br from-red-950/50 via-gray-900 to-slate-900"
            : "border-red-100 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50"
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
              isDarkMode ? "border-red-800/50 bg-black/30" : "border-red-200 bg-white/80"
            }`}
          >
            <div>
              <p className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
                Total Revenue
              </p>
              <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {formatCurrency(metrics.totalRevenue)}
              </p>
            </div>
            <Wallet className={`h-7 w-7 ${isDarkMode ? "text-red-300" : "text-red-500"}`} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className={`rounded-xl border p-3 ${isDarkMode ? "border-gray-800 bg-black/20" : "border-red-100 bg-white/80"}`}>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Stall Revenue</p>
            <p className={`text-lg font-semibold ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>
              {formatCurrency(metrics.stallRevenue)}
            </p>
          </div>
          <div className={`rounded-xl border p-3 ${isDarkMode ? "border-gray-800 bg-black/20" : "border-red-100 bg-white/80"}`}>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Show Revenue</p>
            <p className={`text-lg font-semibold ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>
              {formatCurrency(metrics.showRevenue)}
            </p>
          </div>
          <div className={`rounded-xl border p-3 ${isDarkMode ? "border-gray-800 bg-black/20" : "border-red-100 bg-white/80"}`}>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Donation Revenue</p>
            <p className={`text-lg font-semibold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
              {formatCurrency(metrics.donationRevenue)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {registrationCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`rounded-xl border p-4 shadow-sm ${
                isDarkMode ? "border-gray-800 bg-gray-900/70" : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex rounded-lg bg-gradient-to-r p-2 text-white ${cardAccent[card.key]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{card.value}</p>
              </div>
              <p className={`mt-3 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{card.title}</p>
            </div>
          );
        })}
      </section>

      <section
        className={`rounded-2xl border p-5 ${
          isDarkMode ? "border-gray-800 bg-gray-900/70" : "border-gray-100 bg-white"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recent Bookings</h3>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/bookings/stalls"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isDarkMode ? "bg-emerald-900/30 text-emerald-200" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              Stall
            </Link>
            <Link
              href="/admin/bookings/shows"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isDarkMode ? "bg-blue-900/30 text-blue-200" : "bg-blue-50 text-blue-700"
              }`}
            >
              Show
            </Link>
            <Link
              href="/admin/entry-pass-management"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                isDarkMode ? "bg-lime-900/30 text-lime-200" : "bg-lime-50 text-lime-700"
              }`}
            >
              Entry Pass
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
              <tr className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-gray-800" : "divide-gray-100"}`}>
              {metrics.recentBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`px-3 py-8 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    No recent bookings found.
                  </td>
                </tr>
              ) : (
                metrics.recentBookings.map((row) => (
                  <tr key={`${row.type}-${row.id}`} className={isDarkMode ? "hover:bg-gray-800/60" : "hover:bg-red-50/40"}>
                    <td className="px-3 py-2.5 text-sm">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          row.type === "Stall"
                            ? isDarkMode
                              ? "bg-emerald-900/40 text-emerald-200"
                              : "bg-emerald-50 text-emerald-700"
                            : row.type === "Show"
                            ? isDarkMode
                              ? "bg-blue-900/40 text-blue-200"
                              : "bg-blue-50 text-blue-700"
                            : isDarkMode
                            ? "bg-lime-900/40 text-lime-200"
                            : "bg-lime-50 text-lime-700"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className={`px-3 py-2.5 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{row.name}</td>
                    <td className={`px-3 py-2.5 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{row.email}</td>
                    <td className={`px-3 py-2.5 text-sm font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="px-3 py-2.5 text-sm">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${
                          isRevenueStatus(row.status)
                            ? isDarkMode
                              ? "bg-green-900/40 text-green-200"
                              : "bg-green-50 text-green-700"
                            : isDarkMode
                            ? "bg-amber-900/40 text-amber-200"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {String(row.status || "pending").replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className={`px-3 py-2.5 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {row.createdAt ? row.createdAt.toLocaleString("en-IN") : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
