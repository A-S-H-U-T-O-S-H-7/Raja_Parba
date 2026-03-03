"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Ticket } from "lucide-react";
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

  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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
      background: "#fffefc",
    });

    if (result.isConfirmed) {
      await handleStatusUpdate(booking.id, "cancelled");
    }
  };

  return (
    <PermissionGate permission="view_entry_pass_management" showFallback>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Entry Pass Management</h1>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Manage free entry pass registrations and participation.
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"}`}>
            <Ticket className="h-4 w-4" />
            Total: {filteredCount}
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
            onPageSizeChange={() => {}}
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
