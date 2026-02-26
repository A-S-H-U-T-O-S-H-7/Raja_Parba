// app/admin/bookings/stalls/page.jsx
"use client";
import { useEffect } from 'react';
import { Store } from 'lucide-react';
import useStallBookingManagementStore from '@/lib/stores/useStallBookingManagementStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import StallBookingFilters from './StallBookingFilters';
import StallBookingTable from './StallBookingTable';
import StallBookingDetailsModal from './StallBookingDetailsModal';
import StallCancellationModal from './StallCancellationModal';
import ParticipationModal from '../shared/ParticipationModal';
import DocumentViewerModal from '../DocumentViewerModal';
import Pagination from './Pagination';

export default function StallBookingsPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { 
    bookings, 
    loading, 
    isUpdating,
    totalBookings,
    currentPage,
    bookingsPerPage,
    selectedBooking,
    modals,
    fetchBookings,
    updateStatus,
    setFilter,
    setSearchTerm,
    setCurrentPage,
    openModal,
    closeModal
  } = useStallBookingManagementStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Stall Bookings
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and track all stall bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <StallBookingFilters
        onSearch={setSearchTerm}
        onFilterChange={setFilter}
        loading={loading}
      />

      {/* Table */}
      <StallBookingTable
        bookings={bookings}
        loading={loading}
        isUpdating={isUpdating}
        onViewDetails={(booking) => openModal('booking', booking)}
        onCancel={(booking) => openModal('cancellation', booking)}
        onParticipation={(booking) => openModal('participation', booking)}
        onViewDocuments={(booking) => openModal('document', booking)}
        onStatusUpdate={updateStatus}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalBookings}
          itemsPerPage={bookingsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => setFilter('bookingsPerPage', size)}
        />
      )}

      {/* Modals */}
      <StallBookingDetailsModal
        isOpen={modals.booking}
        onClose={() => closeModal('booking')}
        booking={selectedBooking}
      />

      <StallCancellationModal
        isOpen={modals.cancellation}
        onClose={() => closeModal('cancellation')}
        booking={selectedBooking}
        onConfirm={(reason) => {
          updateStatus(selectedBooking.id, 'cancelled', reason);
          closeModal('cancellation');
        }}
        isUpdating={isUpdating}
      />

      <ParticipationModal
        isOpen={modals.participation}
        onClose={() => closeModal('participation')}
        booking={selectedBooking}
        bookingType="stall"
        onSuccess={() => {
          closeModal('participation');
          fetchBookings();
        }}
      />

      <DocumentViewerModal
        isOpen={modals.document}
        onClose={() => closeModal('document')}
        booking={selectedBooking}
      />
    </div>
  );
}