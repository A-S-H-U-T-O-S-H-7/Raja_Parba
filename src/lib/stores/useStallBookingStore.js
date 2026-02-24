// stores/admin/useStallBookingStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, runTransaction, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const useStallBookingStore = create((set, get) => ({
  // State
  selectedStalls: [],
  vendorDetails: {
    businessType: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    aadhar: '',
    pan: ''
  },
  stallAvailability: {},
  stallSettings: null,
  priceSettings: {
    defaultStallPrice: 5000,
    earlyBirdDiscount: 10,
    bulkDiscounts: [
      { min: 3, discount: 5 },
      { min: 5, discount: 10 },
      { min: 10, discount: 15 }
    ]
  },
  eventSettings: {
    startDate: '2025-11-15',
    endDate: '2025-11-20',
    duration: '5 days'
  },
  loading: false,
  step: 1,

  // Actions
  setStep: (step) => set({ step }),
  
  toggleStall: (stallId) => set((state) => ({
    selectedStalls: state.selectedStalls.includes(stallId)
      ? state.selectedStalls.filter(id => id !== stallId)
      : [...state.selectedStalls, stallId]
  })),

  setSelectedStalls: (stalls) => set({ selectedStalls: stalls }),
  
  clearSelection: () => set({ selectedStalls: [] }),

  updateVendorDetails: (details) => set((state) => ({
    vendorDetails: { ...state.vendorDetails, ...details }
  })),

  resetVendorDetails: () => set({
    vendorDetails: {
      businessType: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      aadhar: '',
      pan: ''
    }
  }),

  // Load stall data
  loadStallData: async () => {
    set({ loading: true });
    try {
      // Load stall settings
      const stallRef = doc(db, 'settings', 'stalls');
      const stallSnap = await getDoc(stallRef);
      
      if (stallSnap.exists()) {
        set({ stallSettings: stallSnap.data() });
        
        // Update event settings
        if (stallSnap.data().eventDates) {
          set({ eventSettings: stallSnap.data().eventDates });
        }
      }

      // Load stall availability
      const availabilityRef = doc(db, 'stallAvailability', 'current');
      const availabilitySnap = await getDoc(availabilityRef);
      
      if (availabilitySnap.exists()) {
        set({ stallAvailability: availabilitySnap.data().stalls || {} });
      }
    } catch (error) {
      console.error('Error loading stall data:', error);
      toast.error('Failed to load stall data');
    } finally {
      set({ loading: false });
    }
  },

  // Price calculations
  getBaseAmount: () => {
    const { selectedStalls, priceSettings } = get();
    return selectedStalls.length * priceSettings.defaultStallPrice;
  },

  getEarlyBirdDiscount: () => {
    const { priceSettings } = get();
    return priceSettings.earlyBirdDiscount || 0;
  },

  getBulkDiscount: () => {
    const { selectedStalls, priceSettings } = get();
    const count = selectedStalls.length;
    
    if (!priceSettings.bulkDiscounts) return 0;
    
    const applicableDiscount = priceSettings.bulkDiscounts
      .filter(d => count >= d.min)
      .sort((a, b) => b.discount - a.discount)[0];
    
    return applicableDiscount?.discount || 0;
  },

  getDiscountAmount: () => {
    const baseAmount = get().getBaseAmount();
    const earlyBirdDiscount = get().getEarlyBirdDiscount();
    const bulkDiscount = get().getBulkDiscount();
    
    // Use the higher discount
    const discountPercent = Math.max(earlyBirdDiscount, bulkDiscount);
    return (baseAmount * discountPercent) / 100;
  },

  getTotalAmount: () => {
    const baseAmount = get().getBaseAmount();
    const discountAmount = get().getDiscountAmount();
    return baseAmount - discountAmount;
  },

  getNextMilestone: () => {
    const { selectedStalls, priceSettings } = get();
    const count = selectedStalls.length;
    
    if (!priceSettings.bulkDiscounts) return null;
    
    const nextMilestone = priceSettings.bulkDiscounts
      .filter(d => d.min > count)
      .sort((a, b) => a.min - b.min)[0];
    
    if (nextMilestone) {
      return {
        quantityNeeded: nextMilestone.min - count,
        discountPercent: nextMilestone.discount
      };
    }
    
    return null;
  },

  // Reset booking
  resetBooking: () => set({
    selectedStalls: [],
    vendorDetails: {
      businessType: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      aadhar: '',
      pan: ''
    },
    step: 1
  })
}));

export default useStallBookingStore;