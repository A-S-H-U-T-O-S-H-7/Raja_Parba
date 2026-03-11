// stores/admin/useShowSeatManagementStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
  generateShowSeatLayout,
  normalizeShowPricing,
  normalizeShowSettings
} from '@/utils/showSeatUtils';

const useShowSeatManagementStore = create((set, get) => ({
  // State
  seats: [],
  showSettings: null,
  showPricing: { blockPrices: {} },
  selectedDate: new Date(),
  viewMode: 'grid',
  selectedSeats: [],
  filterStatus: 'all',
  isUpdating: false,
  showUserDetails: null,
  loading: true,
  dateLoading: false,
  dateInitialized: false,
  
  // Real-time listeners
  unsubscribeShowSettings: null,
  unsubscribeShowPricing: null,
  unsubscribeAvailability: null,

  // Initialize
  initialize: () => {
    get().setupShowSettingsListener();
    get().setupShowPricingListener();
  },

  setupShowPricingListener: () => {
    const showPricingRef = doc(db, 'settings', 'showPricing');

    const unsubscribe = onSnapshot(
      showPricingRef,
      (docSnap) => {
        const pricing = normalizeShowPricing(docSnap.exists() ? docSnap.data() : {}, get().showSettings);
        set({
          showPricing: pricing,
          seats: generateShowSeatLayout(get().showSettings, pricing.blockPrices)
        });
      },
      (error) => {
        console.error('Error listening to show pricing:', error);
      }
    );

    set({ unsubscribeShowPricing: unsubscribe });
  },

  // Setup show settings listener
  setupShowSettingsListener: () => {
    const showSettingsRef = doc(db, 'settings', 'shows');
    
    const unsubscribe = onSnapshot(
      showSettingsRef,
      (doc) => {
        if (doc.exists()) {
          const data = normalizeShowSettings(doc.data());
          set({ showSettings: data });
          
          // Generate seats layout
          const seatLayout = generateShowSeatLayout(data, get().showPricing?.blockPrices);
          set({ seats: seatLayout, loading: false });
          
          // Set default date if not initialized
          if (!get().dateInitialized && data.eventDates) {
            let defaultDate = null;
            
            if (data.eventDates.startDate && data.eventDates.endDate) {
              defaultDate = new Date(data.eventDates.startDate);
            } else if (data.eventDates.enabled || data.eventDates.isActive) {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              defaultDate = tomorrow;
            }
            
            if (defaultDate) {
              get().setSelectedDate(defaultDate);
            }
            set({ dateInitialized: true });
          }
        } else {
          // Generate default seats layout
          const seatLayout = generateShowSeatLayout(null, get().showPricing?.blockPrices);
          set({ seats: seatLayout, showSettings: null, loading: false });
          set({ dateInitialized: true });
        }
      },
      (error) => {
        console.error('Error listening to show settings:', error);
        toast.error('Failed to load show settings');
        
        // Generate default seats layout on error
        const seatLayout = generateShowSeatLayout(null, get().showPricing?.blockPrices);
        set({ seats: seatLayout, loading: false, dateInitialized: true });
      }
    );
    
    set({ unsubscribeShowSettings: unsubscribe });
  },

  // Setup availability listener for selected date
  setupAvailabilityListener: (date) => {
    if (!date) return;

    set({ dateLoading: true, selectedSeats: [] });

    const dateKey = format(date, 'yyyy-MM-dd');
    const availabilityRef = doc(db, 'showSeatAvailability', dateKey);
    
    const unsubscribe = onSnapshot(
      availabilityRef, 
      (doc) => {
        try {
          const seatAvailability = doc.exists() ? doc.data().seats || {} : {};
          
          set(state => ({
            seats: state.seats.map(seat => {
              const availability = seatAvailability[seat.id];
              let status = 'available';
              if (availability) {
                if (availability.blocked === true) status = 'blocked';
                else if (availability.booked === true) status = 'booked';
              }
              return {
                ...seat,
                status,
                bookingId: availability?.bookingId,
                userId: availability?.userId,
                bookedAt: availability?.bookedAt,
                userEmail: availability?.userEmail,
                userName: availability?.userName,
                userPhone: availability?.userPhone
              };
            }),
            dateLoading: false
          }));
        } catch (error) {
          console.error('Error processing seat availability:', error);
          toast.error('Failed to update seat availability');
          set({ dateLoading: false });
        }
      },
      (error) => {
        console.error('Error listening to seat availability:', error);
        toast.error('Failed to fetch seat availability');
        set({ dateLoading: false });
      }
    );
    
    set({ unsubscribeAvailability: unsubscribe });
  },

  // Set selected date
  setSelectedDate: (date) => {
    // Cleanup old listener
    if (get().unsubscribeAvailability) {
      get().unsubscribeAvailability();
    }
    
    set({ selectedDate: date });
    
    if (date) {
      get().setupAvailabilityListener(date);
    } else {
      // Reset seat statuses to available
      set(state => ({
        seats: state.seats.map(seat => ({ 
          ...seat, 
          status: 'available',
          bookingId: undefined,
          userId: undefined,
          bookedAt: undefined,
          userEmail: undefined,
          userName: undefined,
          userPhone: undefined
        }))
      }));
    }
  },

  // Set view mode
  setViewMode: (mode) => set({ viewMode: mode }),

  // Set filter status
  setFilterStatus: (status) => set({ filterStatus: status }),

  // Handle seat click
  handleSeatClick: (seat) => {
    const { selectedSeats, showUserDetails } = get();
    
    if (seat.status === 'booked') {
      // Show user details for booked seats
      set({
        showUserDetails: {
          id: seat.id,
          userName: seat.userName || 'N/A',
          userEmail: seat.userEmail || 'N/A',
          userPhone: seat.userPhone || 'N/A',
          bookingId: seat.bookingId || 'N/A',
          bookedAt: seat.bookedAt?.toDate?.() 
            ? seat.bookedAt.toDate().toLocaleString() 
            : 'N/A'
        }
      });
      return;
    }
    
    // Toggle selection
    set({
      selectedSeats: selectedSeats.includes(seat.id)
        ? selectedSeats.filter(id => id !== seat.id)
        : [...selectedSeats, seat.id]
    });
  },

  // Clear selection
  clearSelection: () => set({ selectedSeats: [] }),

  // Close user details modal
  closeUserDetails: () => set({ showUserDetails: null }),

  // Handle status change (block/unblock)
  handleStatusChange: async (seatIds, newStatus) => {
  const { selectedDate, adminUser } = get();
  
  if (!selectedDate) {
    toast.error('Please select a date first');
    return;
  }
  
  set({ isUpdating: true });
  
  try {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const availabilityRef = doc(db, 'showSeatAvailability', dateKey);
    
    // Get current availability
    const currentDoc = await getDoc(availabilityRef);
    const currentSeats = currentDoc.exists() ? currentDoc.data().seats || {} : {};
    
    // Prepare updates
    const updatedSeats = { ...currentSeats };
    
    seatIds.forEach(seatId => {
      if (newStatus === 'blocked') {
        updatedSeats[seatId] = {
          blocked: true,
          blockedAt: serverTimestamp(),
          blockedBy: adminUser?.id || 'admin',
          blockedReason: 'Blocked by admin',
          booked: false,
          bookingId: null,
          userId: null,
          userEmail: null,
          userName: null,
          userPhone: null
        };
      } else if (newStatus === 'available') {
        if (updatedSeats[seatId]) {
          // Completely remove the seat entry to make it available
          delete updatedSeats[seatId];
        }
      }
    });
    
    // Save to Firestore
    await setDoc(availabilityRef, {
      seats: updatedSeats,
      lastUpdated: serverTimestamp(),
      date: dateKey
    }, { merge: true });
    
    // Clear selection
    set({ selectedSeats: [] });
    
    // Immediately update local state for better UX
    set(state => ({
      seats: state.seats.map(seat => {
        if (seatIds.includes(seat.id)) {
          if (newStatus === 'blocked') {
            return {
              ...seat,
              status: 'blocked',
              bookingId: undefined,
              userId: undefined,
              bookedAt: undefined,
              userEmail: undefined,
              userName: undefined,
              userPhone: undefined
            };
          } else if (newStatus === 'available') {
            return {
              ...seat,
              status: 'available',
              bookingId: undefined,
              userId: undefined,
              bookedAt: undefined,
              userEmail: undefined,
              userName: undefined,
              userPhone: undefined
            };
          }
        }
        return seat;
      })
    }));
    
    toast.success(`${seatIds.length} seats ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} for ${dateKey}`);
    
  } catch (error) {
    console.error('Error updating seat status:', error);
    toast.error('Failed to update seat status');
  } finally {
    set({ isUpdating: false });
  }
},
  // Select all filtered seats
  selectAllFiltered: () => {
    const { seats, filterStatus } = get();
    const filteredSeats = seats.filter(seat => {
      if (filterStatus === 'all') return true;
      return seat.status === filterStatus;
    });
    set({ selectedSeats: filteredSeats.map(seat => seat.id) });
  },

  // Cleanup listeners
  cleanup: () => {
    const { unsubscribeShowSettings, unsubscribeShowPricing, unsubscribeAvailability } = get();
    if (unsubscribeShowSettings) unsubscribeShowSettings();
    if (unsubscribeShowPricing) unsubscribeShowPricing();
    if (unsubscribeAvailability) unsubscribeAvailability();
  },

  // Get filtered seats
  getFilteredSeats: () => {
    const { seats, filterStatus } = get();
    if (filterStatus === 'all') return seats;
    return seats.filter(seat => seat.status === filterStatus);
  },

  // Get status counts
  getStatusCounts: () => {
    const { seats } = get();
    return seats.reduce((acc, seat) => {
      acc[seat.status] = (acc[seat.status] || 0) + 1;
      return acc;
    }, { available: 0, booked: 0, blocked: 0 });
  },

  // Get status color
  getStatusColor: (status) => {
    const { isDarkMode } = get();
    switch (status) {
      case 'available': 
        return isDarkMode ? 'bg-green-800/80 text-green-100' : 'bg-green-100 text-green-800';
      case 'booked': 
        return isDarkMode ? 'bg-blue-800/80 text-blue-100' : 'bg-blue-100 text-blue-800';
      case 'blocked': 
        return isDarkMode ? 'bg-red-800/80 text-red-100' : 'bg-red-100 text-red-800';
      default: 
        return isDarkMode ? 'bg-gray-800/80 text-gray-100' : 'bg-gray-100 text-gray-800';
    }
  },

  // Get seat color
  getSeatColor: (seat) => {
    const { isDarkMode, selectedSeats } = get();
    
    if (seat.status === 'booked') 
      return isDarkMode ? 'bg-blue-700/70 text-blue-100' : 'bg-blue-500/80 text-white';
    
    if (seat.status === 'blocked') 
      return isDarkMode ? 'bg-red-700/70 text-red-100' : 'bg-red-500/80 text-white';
    
    if (selectedSeats.includes(seat.id)) 
      return isDarkMode ? 'bg-purple-600 text-purple-100' : 'bg-purple-500 text-white';
    
    if (seat.type === 'VIP') 
      return isDarkMode ? 'bg-gradient-to-br from-amber-700/80 via-yellow-700/80 to-amber-800/80 text-yellow-100' : 'bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-400 text-amber-900';

    return isDarkMode ? 'bg-emerald-700/80 text-emerald-100' : 'bg-emerald-400 text-emerald-900';
  },

  // Reset
  reset: () => {
    get().cleanup();
    set({
      seats: [],
      showSettings: null,
      showPricing: { blockPrices: {} },
      selectedDate: new Date(),
      viewMode: 'grid',
      selectedSeats: [],
      filterStatus: 'all',
      isUpdating: false,
      showUserDetails: null,
      loading: true,
      dateLoading: false,
      dateInitialized: false
    });
  }
}));

export default useShowSeatManagementStore;
