// components/admin/dashboard/OverviewStats.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import useThemeStore from "@/lib/stores/useThemeStore";
import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
import RecentBookingsTable from "./RecentBookingsTable";
import { Loader2 } from "lucide-react";

// Utility functions
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72 mt-16 lg:mt-0">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-16 lg:mt-0">
      {error && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isDarkMode
              ? "border-red-900/70 bg-red-950/40 text-red-200"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <DashboardHeader 
        totalRevenue={metrics.totalRevenue}
        stallRevenue={metrics.stallRevenue}
        showRevenue={metrics.showRevenue}
        donationRevenue={metrics.donationRevenue}
      />
      
      <StatsGrid metrics={metrics} />
      
      <RecentBookingsTable bookings={metrics.recentBookings} />
    </div>
  );
}