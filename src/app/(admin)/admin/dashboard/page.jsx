"use client";

import OverviewStats from "@/components/admin/dashboard/OverviewStats";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export default function AdminDashboardPage() {
  const { admin } = useAdminAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {admin?.name || admin?.username}!
        </h2>
        <p className="text-purple-100">
          Here's what's happening with Raja Mahotsav today.
        </p>
      </div>

      <OverviewStats />
    </div>
  );
}