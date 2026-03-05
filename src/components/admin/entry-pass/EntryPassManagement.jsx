// app/admin/entry-pass-management/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { ArrowLeft, RefreshCw, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { db } from "@/lib/firebase/config";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import adminLogger from "@/lib/adminLogger";
import EntryPassFilters from "./EntryPassFilters";
import EntryPassTable from "./EntryPassTable";
import EntryPassDetailsModal from "./EntryPassDetailsModal";
import Pagination from "@/components/admin/shared/Pagination";
import ParticipationModal from "@/components/admin/shared/ParticipationModal";
import PermissionGate from "@/components/admin/PermissionGate";

const BOOKINGS_PER_PAGE = 10;

const normalizeDate = (value) => {
  if (!value) return null;
  if (value?.toDate && typeof value.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function EntryPassManagement() {
  const { isDarkMode } = useThemeStore();
  const { admin, hasPermission } = useAdminAuthStore();
  const router = useRouter();
  const isDark = isDarkMode;

  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [participationFilter, setParticipationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false);

  const adminActor = useMemo(() => {
    if (!admin) return null;
    return {
      ...admin,
      uid: admin.uid || admin.id,
    };
  }, [admin]);
  const canManageBookings = hasPermission("manage_bookings");

  const fetchEntryPassBookings = async () => {
    setLoading(true);
    try {
      const entryQuery = query(
        collection(db, "delegateBookings"),
        where("category", "==", "free_pass"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(entryQuery);
      const rows = snapshot.docs.map((document) => {
        const data = document.data();
        return {
          id: document.id,
          ...data,
          createdAt: normalizeDate(data.createdAt),
          updatedAt: normalizeDate(data.updatedAt),
          participatedAt: normalizeDate(data.participatedAt),
        };
      });
      setAllBookings(rows);
    } catch (error) {
      console.error("Failed to load entry pass data:", error);
      toast.error("Failed to load entry pass records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEntryPassBookings();
  }, []);

  useEffect(() => {
    let filtered = [...allBookings];

    if (searchTerm.trim()) {
      const text = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) => {
        const details = booking.delegateDetails || {};
        return (
          booking.id?.toLowerCase().includes(text) ||
          details.name?.toLowerCase().includes(text) ||
          details.email?.toLowerCase().includes(text) ||
          details.mobile?.toLowerCase().includes(text)
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (participationFilter !== "all") {
      filtered = filtered.filter((booking) =>
        participationFilter === "yes" ? booking.participated === true : booking.participated !== true
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      let start = new Date();
      if (dateFilter === "today") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateFilter === "week") {
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === "month") {
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      filtered = filtered.filter((booking) => booking.createdAt && booking.createdAt >= start);
    }

    const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
    const endIndex = startIndex + BOOKINGS_PER_PAGE;
    setBookings(filtered.slice(startIndex, endIndex));
  }, [allBookings, searchTerm, statusFilter, participationFilter, dateFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, participationFilter, dateFilter]);

  const filteredCount = useMemo(() => {
    let filtered = [...allBookings];
    if (searchTerm.trim()) {
      const text = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) => {
        const details = booking.delegateDetails || {};
        return (
          booking.id?.toLowerCase().includes(text) ||
          details.name?.toLowerCase().includes(text) ||
          details.email?.toLowerCase().includes(text) ||
          details.mobile?.toLowerCase().includes(text)
        );
      });
    }
    if (statusFilter !== "all") filtered = filtered.filter((booking) => booking.status === statusFilter);
    if (participationFilter !== "all") {
      filtered = filtered.filter((booking) =>
        participationFilter === "yes" ? booking.participated === true : booking.participated !== true
      );
    }
    if (dateFilter !== "all") {
      const now = new Date();
      let start = new Date();
      if (dateFilter === "today") start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (dateFilter === "week") start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (dateFilter === "month") start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((booking) => booking.createdAt && booking.createdAt >= start);
    }
    return filtered.length;
  }, [allBookings, searchTerm, statusFilter, participationFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / BOOKINGS_PER_PAGE));

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!hasPermission("manage_bookings")) {
      toast.error("You do not have permission to change status");
      return;
    }

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "delegateBookings", bookingId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      if (adminActor) {
        await adminLogger.logBookingActivity(
          adminActor,
          "update",
          bookingId,
          `Updated entry pass booking status to ${newStatus}`
        );
      }

      toast.success(`Status updated to ${newStatus}`);
      await fetchEntryPassBookings();
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleParticipationSuccess = (bookingId) => {
    setAllBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              participated: true,
              participatedAt: new Date(),
              participatedBy: adminActor?.uid || booking.participatedBy,
            }
          : booking
      )
    );
    setShowParticipationModal(false);
  };

  const handleCancelWithConfirm = async (booking) => {
    if (!hasPermission("manage_bookings")) {
      toast.error("You do not have permission to cancel");
      return;
    }

    const result = await Swal.fire({
      title: "Cancel Entry Pass?",
      text: `Are you sure you want to cancel ${booking.id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#f9fafb" : "#111827",
    });

    if (result.isConfirmed) {
      await handleStatusUpdate(booking.id, "cancelled");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEntryPassBookings();
  };

  return (
    <PermissionGate permission="view_entry_pass_management" showFallback>
      <div className="min-h-screen transition-colors duration-300 p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => router.back()}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                    : "bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`} />
              </button>
              <div>
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r truncate ${
                  isDark ? "from-indigo-400 to-blue-400" : "from-indigo-600 to-blue-600"
                } bg-clip-text text-transparent`}>
                  Entry Pass Management
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage free entry pass registrations and participation • Total: {filteredCount}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
                } ${(loading || refreshing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>
            </div>
          </div>

          <EntryPassFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            participationFilter={participationFilter}
            onParticipationChange={setParticipationFilter}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
            loading={loading}
          />
        </div>

        <EntryPassTable
          bookings={bookings}
          loading={loading}
          isUpdating={isUpdating}
          currentPage={currentPage}
          bookingsPerPage={BOOKINGS_PER_PAGE}
          onViewDetails={(booking) => {
            setSelectedBooking(booking);
            setShowDetailsModal(true);
          }}
          onConfirm={(booking) => handleStatusUpdate(booking.id, "confirmed")}
          onCancel={handleCancelWithConfirm}
          onParticipation={(booking) => {
            if (!canManageBookings) {
              toast.error("You do not have permission to mark participation");
              return;
            }
            setSelectedBooking(booking);
            setShowParticipationModal(true);
          }}
          canManageBookings={canManageBookings}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCount}
            itemsPerPage={BOOKINGS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        <EntryPassDetailsModal
          isOpen={showDetailsModal}
          booking={selectedBooking}
          onClose={() => setShowDetailsModal(false)}
        />

        <ParticipationModal
          isOpen={showParticipationModal}
          onClose={() => setShowParticipationModal(false)}
          booking={selectedBooking}
          bookingType="delegate"
          onSuccess={handleParticipationSuccess}
        />
      </div>
    </PermissionGate>
  );
}