// app/admin/bookings/shows/page.jsx
"use client";
import { useEffect } from 'react';
import { Ticket } from 'lucide-react';
import useShowBookingManagementStore from '@/lib/stores/useShowBookingManagementStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import ShowBookingFilters from './ShowBookingFilters';
import ShowBookingTable from './ShowBookingTable';
import ShowBookingDetailsModal from './ShowBookingDetailsModal';
import ShowCancellationModal from './ShowCancellationModal';
import ParticipationModal from '../shared/ParticipationModal';
import Pagination from './Pagination';

export default function ShowBookingsPage() {
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
    searchTerm,
    statusFilter,
    participationFilter,
    dateFilter,
    selectedDate,
    bookingDate,
    initialize,
    setAdminUser,
    setSearchTerm,
    setFilter,
    setCurrentPage,
    openModal,
    closeModal,
    updateStatus,
    deleteBooking,
    updateParticipation
  } = useShowBookingManagementStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    setAdminUser(admin ? { ...admin, uid: admin.uid || admin.id } : null);
  }, [admin, setAdminUser]);

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  const handleParticipationSuccess = (bookingId) => {
    updateParticipation(bookingId, true);
    closeModal('participation');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Show Bookings
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and track all show bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <ShowBookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={(value) => setFilter('statusFilter', value)}
        participationFilter={participationFilter}
        onParticipationChange={(value) => setFilter('participationFilter', value)}
        dateFilter={dateFilter}
        onDateChange={(value) => setFilter('dateFilter', value)}
        selectedDate={selectedDate}
        onSelectedDateChange={(value) => setFilter('selectedDate', value)}
        bookingDate={bookingDate}
        onBookingDateChange={(value) => setFilter('bookingDate', value)}
        onSearch={() => {}} // Handled by store
        loading={loading}
      />

      {/* Table */}
      <ShowBookingTable
        bookings={bookings}
        loading={loading}
        isUpdating={isUpdating}
        currentPage={currentPage}
        bookingsPerPage={bookingsPerPage}
        canManageBookings
        onViewDetails={(booking) => openModal('booking', booking)}
        onCancel={(booking) => openModal('cancellation', booking)}
        onParticipation={(booking) => openModal('participation', booking)}
        onDelete={(booking) => deleteBooking(booking.id)}
        onApproveCancellation={(booking) => updateStatus(booking.id, 'cancelled')}
        onRejectCancellation={(booking) => updateStatus(booking.id, 'confirmed')}
        onConfirm={(booking) => updateStatus(booking.id, 'confirmed')}
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
      <ShowBookingDetailsModal
        isOpen={modals.booking}
        onClose={() => closeModal('booking')}
        booking={selectedBooking}
      />

      <ShowCancellationModal
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
        bookingType="show"
        onSuccess={handleParticipationSuccess}
      />
    </div>
  );
}
