// stores/admin/useStallBookingManagementStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { cancelBooking } from '@/utils/cancellationUtils';
import adminLogger from '@/lib/adminLogger';

const useStallBookingManagementStore = create((set, get) => ({
  // State
  bookings: [],
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
  
  // Selected booking
  selectedBooking: null,
  
  // Modal states
  modals: {
    booking: false,
    payment: false,
    cancellation: false,
    participation: false,
    document: false
  },

  // Fetch bookings with filters
  fetchBookings: async () => {
    const { 
      currentPage, 
      bookingsPerPage, 
      statusFilter, 
      dateFilter,
      searchTerm 
    } = get();
    
    set({ loading: true });

    try {
      const queryConstraints = [];
      
      if (statusFilter !== 'all') {
        queryConstraints.push(where('status', '==', statusFilter));
      }
      
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (dateFilter) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        }
        
        if (startDate) {
          queryConstraints.push(where('createdAt', '>=', startDate));
        }
      }
      
      queryConstraints.push(orderBy('createdAt', 'desc'));
      
      const bookingsQuery = query(
        collection(db, 'stallBookings'), 
        ...queryConstraints
      );

      const snapshot = await getDocs(bookingsQuery);
      const bookingsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          stallIds: data.stallIds || [data.stallId].filter(Boolean),
          vendorDetails: {
            name: data.vendorDetails?.ownerName || data.vendorDetails?.name || data.ownerName || data.name || 'N/A',
            email: data.vendorDetails?.email || data.email || 'N/A',
            phone: data.vendorDetails?.phone || data.phone || 'N/A',
            businessType: data.vendorDetails?.businessType || data.businessType || 'N/A',
            aadhar: data.vendorDetails?.aadhar || data.aadhar,
            address: data.vendorDetails?.address || data.address
          },
          totalAmount: data.payment?.amount || data.totalAmount || data.amount || 0,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        };
      });

      // Apply client-side filters
      let filteredBookings = bookingsData;
      
      if (searchTerm) {
        filteredBookings = filteredBookings.filter(booking => 
          booking.vendorDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.vendorDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.stallIds?.some(id => id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (get().participationFilter !== 'all') {
        filteredBookings = filteredBookings.filter(booking => 
          get().participationFilter === 'yes' ? booking.participated : !booking.participated
        );
      }

      set({ totalBookings: filteredBookings.length });
      
      // Apply pagination
      const start = (currentPage - 1) * bookingsPerPage;
      const end = start + bookingsPerPage;
      set({ 
        bookings: filteredBookings.slice(start, end),
        loading: false 
      });

    } catch (error) {
      console.error('Error fetching stall bookings:', error);
      toast.error('Failed to load stall bookings');
      set({ loading: false });
    }
  },

  // Update booking status
  updateStatus: async (bookingId, newStatus, reason = '') => {
    set({ isUpdating: true });
    
    try {
      if (newStatus === 'cancelled') {
        const booking = get().bookings.find(b => b.id === bookingId);
        if (!booking) throw new Error('Booking not found');

        const result = await cancelBooking(
          booking,
          reason,
          { ...get().adminUser, isAdmin: true },
          true
        );
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        toast.success(result.message);
      } else {
        await updateDoc(doc(db, 'stallBookings', bookingId), {
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

      set(state => ({
        bookings: state.bookings.map(b => 
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      }));

      await get().fetchBookings();

    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    } finally {
      set({ isUpdating: false });
    }
  },

  // Set filter
  setFilter: (key, value) => {
    set({ [key]: value, currentPage: 1 });
    get().fetchBookings();
  },

  // Set search term with debounce
  setSearchTerm: (term) => {
    set({ searchTerm: term, currentPage: 1 });
    
    clearTimeout(get().searchTimeout);
    const timeout = setTimeout(() => get().fetchBookings(), 500);
    set({ searchTimeout: timeout });
  },

  // Pagination
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchBookings();
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

  // Cleanup
  reset: () => set({
    bookings: [],
    loading: true,
    isUpdating: false,
    totalBookings: 0,
    currentPage: 1,
    searchTerm: '',
    statusFilter: 'all',
    participationFilter: 'all',
    dateFilter: 'all',
    selectedBooking: null,
    modals: {
      booking: false,
      payment: false,
      cancellation: false,
      participation: false,
      document: false
    }
  })
}));

export default useStallBookingManagementStore;