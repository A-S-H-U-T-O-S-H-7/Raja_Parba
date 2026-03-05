// app/admin/bookings/stalls/page.jsx
"use client";
import { useEffect } from 'react';
import { Store, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useStallBookingManagementStore from '@/lib/stores/useStallBookingManagementStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import StallBookingFilters from './StallBookingFilters';
import StallBookingTable from './StallBookingTable';
import StallBookingDetailsModal from './StallBookingDetailsModal';
import StallCancellationModal from './StallCancellationModal';
import ParticipationModal from '../shared/ParticipationModal';
import DocumentViewerModal from '../DocumentViewerModal';

export default function StallBookingsPage() {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const isDark = isDarkMode;
  
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
  }, [currentPage, bookingsPerPage]);

  const totalPages = Math.ceil(totalBookings / bookingsPerPage);

  return (
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
                Stall Bookings
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and track all stall bookings • Total: {totalBookings}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => fetchBookings()}
              disabled={loading}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <StallBookingFilters
          onSearch={setSearchTerm}
          onFilterChange={setFilter}
          loading={loading}
        />
      </div>

      {/* Table with Pagination Inside */}
      <StallBookingTable
        bookings={bookings}
        loading={loading}
        isUpdating={isUpdating}
        onViewDetails={(booking) => openModal('booking', booking)}
        onCancel={(booking) => openModal('cancellation', booking)}
        onParticipation={(booking) => openModal('participation', booking)}
        onViewDocuments={(booking) => openModal('document', booking)}
        onStatusUpdate={updateStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        totalBookings={totalBookings}
        bookingsPerPage={bookingsPerPage}
        onPageChange={setCurrentPage}
      />

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
