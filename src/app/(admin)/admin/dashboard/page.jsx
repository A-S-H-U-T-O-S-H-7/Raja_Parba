"use client";

import OverviewStats from "@/components/admin/dashboard/OverviewStats";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export default function AdminDashboardPage() {
  const { admin } = useAdminAuthStore();

  return (
    <div className="space-y-6">
      <OverviewStats />
    </div>
  );
}
