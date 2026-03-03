// stores/admin/useShowBookingManagementStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { cancelBooking } from '@/utils/cancellationUtils';
import adminLogger from '@/lib/adminLogger';

const useShowBookingManagementStore = create((set, get) => ({
  // State
  bookings: [],
  allBookingsData: [],
  loading: true,
  isUpdating: false,
  totalBookings: 0,
  currentPage: 1,
  bookingsPerPage: 10,
  
  // Filters
  searchTerm: '',
  statusFilter: 'all',
  participationFilter: 'all',
  dateFilter: 'all',
  selectedDate: null,
  bookingDate: null,
  
  // Selected booking
  selectedBooking: null,
  adminUser: null,
  
  // Modal states
  modals: {
    booking: false,
    cancellation: false,
    participation: false
  },

  // Search timeout for debounce
  searchTimeout: null,

  // Initialize
  initialize: () => {
    get().fetchBookings();
  },

  setAdminUser: (adminUser) => {
    set({ adminUser });
  },

  // Fetch bookings with filters
  fetchBookings: async () => {
    const { 
      statusFilter, 
      dateFilter,
      searchTerm 
    } = get();
    
    set({ loading: true });

    try {
      // Try to get all bookings first for client-side filtering
      let snapshot;
      try {
        snapshot = await getDocs(collection(db, 'showBookings'));
      } catch (error) {
        console.error('Failed to access showBookings collection:', error);
        toast.error('Unable to access booking data');
        set({ loading: false });
        return;
      }
      
      const bookingsData = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const bookingTimestamp = data.bookingDate || data.createdAt;
        
        bookingsData.push({
          id: doc.id,
          ...data,
          createdAt: bookingTimestamp?.toDate?.() || bookingTimestamp,
          bookingDate: bookingTimestamp?.toDate?.() || bookingTimestamp,
          showDetails: {
            ...data.showDetails,
            date: data.showDetails?.date ? 
              (typeof data.showDetails.date === 'string' ? 
                new Date(data.showDetails.date) : 
                data.showDetails.date?.toDate?.() || data.showDetails.date
              ) : null
          }
        });
      });

      // Store all data for client-side filtering
      set({ allBookingsData: bookingsData });
      
      // Apply all filters client-side
      get().applyClientSideFilters();

    } catch (error) {
      console.error('Error fetching show bookings:', error);
      toast.error('Failed to load show bookings');
      set({ loading: false });
    }
  },

  // Apply client-side filters
  applyClientSideFilters: () => {
    const { 
      allBookingsData, 
      statusFilter, 
      dateFilter, 
      selectedDate, 
      bookingDate, 
      participationFilter, 
      searchTerm,
      currentPage,
      bookingsPerPage 
    } = get();

    let filteredBookings = [...allBookingsData];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(now.getDate() - 30);
          break;
        case '3months':
          startDate.setDate(now.getDate() - 90);
          break;
      }
      
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDateObj = booking.bookingDate || booking.createdAt;
        return bookingDateObj && bookingDateObj >= startDate;
      });
    }
    
    // Apply specific show date filter
    if (selectedDate) {
      const targetDate = new Date(selectedDate);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filteredBookings = filteredBookings.filter(booking => {
        const showDate = booking.showDetails?.date;
        if (!showDate) return false;
        
        let showDateObj;
        if (typeof showDate === 'string') {
          showDateObj = new Date(showDate);
        } else if (showDate.toDate && typeof showDate.toDate === 'function') {
          showDateObj = showDate.toDate();
        } else {
          showDateObj = new Date(showDate);
        }
        
        showDateObj.setHours(0, 0, 0, 0);
        return showDateObj >= targetDate && showDateObj < nextDay;
      });
    }
    
    // Apply booking date filter
    if (bookingDate) {
      const targetDate = new Date(bookingDate);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDateObj = booking.bookingDate || booking.createdAt;
        if (!bookingDateObj) return false;
        
        const normalizedDate = new Date(bookingDateObj);
        normalizedDate.setHours(0, 0, 0, 0);
        return normalizedDate >= targetDate && normalizedDate < nextDay;
      });
    }
    
    // Apply participation filter
    if (participationFilter !== 'all') {
      filteredBookings = filteredBookings.filter(booking => {
        const hasParticipated = booking.participated === true;
        return participationFilter === 'yes' ? hasParticipated : !hasParticipated;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.showDetails?.selectedSeats?.some(seat => 
          String(seat).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Sort by date (most recent first)
    filteredBookings.sort((a, b) => {
      const dateA = a.bookingDate || a.createdAt || new Date(0);
      const dateB = b.bookingDate || b.createdAt || new Date(0);
      return dateB - dateA;
    });

    set({ totalBookings: filteredBookings.length });
    
    // Apply pagination
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    set({ 
      bookings: filteredBookings.slice(startIndex, endIndex),
      loading: false 
    });
  },

  // Set filter with auto-refresh
  setFilter: (key, value) => {
    set({ [key]: value, currentPage: 1 });
    get().applyClientSideFilters();
  },

  // Set search term with debounce
  setSearchTerm: (term) => {
    set({ searchTerm: term, currentPage: 1 });
    
    clearTimeout(get().searchTimeout);
    const timeout = setTimeout(() => get().applyClientSideFilters(), 500);
    set({ searchTimeout: timeout });
  },

  // Pagination
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().applyClientSideFilters();
  },

  // Update booking status
  updateStatus: async (bookingId, newStatus, reason = '') => {
    set({ isUpdating: true });
    
    try {
      if (newStatus === 'cancelled') {
        const booking = get().allBookingsData.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');

        const result = await cancelBooking(
          booking,
          reason,
          { ...get().adminUser, isAdmin: true },
          true
        );
        
        if (!result.success) throw new Error(result.error);
        
        toast.success(result.message);
      } else {
        await updateDoc(doc(db, 'showBookings', bookingId), {
          status: newStatus,
          updatedAt: serverTimestamp()
        });

        await adminLogger.logBookingActivity(
          get().adminUser,
          'update',
          bookingId,
          `Changed status to ${newStatus}`
        );

        toast.success(`Booking ${newStatus} successfully`);
      }

      // Refresh data
      await get().fetchBookings();

    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    } finally {
      set({ isUpdating: false });
    }
  },

  // Delete booking
  deleteBooking: async (bookingId) => {
    const result = await Swal.fire({
      title: 'Delete Show Booking?',
      text: 'This action will permanently remove the booking record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      background: '#fffefc'
    });
    if (!result.isConfirmed) return;

    set({ isUpdating: true });
    
    try {
      await deleteDoc(doc(db, 'showBookings', bookingId));

      await adminLogger.logBookingActivity(
        get().adminUser,
        'delete',
        bookingId,
        'Admin deleted show booking'
      );
      
      toast.success('Booking deleted successfully');
      await get().fetchBookings();

    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    } finally {
      set({ isUpdating: false });
    }
  },

  // Modal controls
  openModal: (modalName, booking = null) => {
    set({ 
      selectedBooking: booking,
      modals: { ...get().modals, [modalName]: true }
    });
  },

  closeModal: (modalName) => {
    set({ 
      modals: { ...get().modals, [modalName]: false },
      selectedBooking: modalName === 'booking' ? null : get().selectedBooking
    });
  },

  // Participation update
  updateParticipation: (bookingId, participated) => {
    set(state => ({
      allBookingsData: state.allBookingsData.map(b => 
        b.id === bookingId 
          ? { 
              ...b, 
              participated, 
              participatedAt: participated ? new Date() : null,
              participatedBy: participated ? state.adminUser?.uid : null
            }
          : b
      )
    }));
    get().applyClientSideFilters();
  },

  // Reset
  reset: () => set({
    bookings: [],
    allBookingsData: [],
    loading: true,
    isUpdating: false,
    totalBookings: 0,
    currentPage: 1,
    searchTerm: '',
    statusFilter: 'all',
    participationFilter: 'all',
    dateFilter: 'all',
    selectedDate: null,
    bookingDate: null,
    selectedBooking: null,
    adminUser: null,
    modals: {
      booking: false,
      cancellation: false,
      participation: false
    }
  })
}));

export default useShowBookingManagementStore;
