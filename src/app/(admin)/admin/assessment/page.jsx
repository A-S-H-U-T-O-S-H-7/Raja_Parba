"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import AssessmentManagement from "@/components/admin/assessment/AssessmentManagement";

export default function AdminAssessmentPage() {
  const { isAuthenticated, loading } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="p-6">
      <AssessmentManagement />
    </div>
  );
}

