// stores/admin/usePriceStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useAdminAuthStore from './useAdminAuthStore';

const usePriceStore = create((set, get) => ({
  // State
  loading: true,
  saving: false,
  syncStatus: 'connected',
  lastSync: null,
  activeTab: 'stall', // 'stall' or 'show'
  
  // Stall Settings
  stall: {
    seatPrice: 5000,
    earlyBirdDiscounts: [
      { daysBeforeEvent: 30, discountPercent: 25, isActive: true }
    ],
    bulkBookingDiscounts: [
      { minSeats: 2, discountPercent: 10, isActive: true }
    ]
  },

  // Show Settings
  show: {
    seatTypes: {
      blockA: { price: 1200, label: 'Block A Premium' },
      blockB: { price: 1000, label: 'Block B Premium' },
      blockC: { price: 600, label: 'Block C Regular' },
      blockD: { price: 400, label: 'Block D Regular' }
    },
    earlyBirdDiscounts: [
      { daysBeforeEvent: 30, discountPercent: 20, isActive: true },
      { daysBeforeEvent: 7, discountPercent: 10, isActive: true }
    ],
    bulkBookingDiscounts: [
      { minSeats: 5, discountPercent: 10, isActive: true },
      { minSeats: 10, discountPercent: 15, isActive: true }
    ]
  },

  // Unsubscribe function for real-time listener
  unsubscribe: null,

  // Set active tab
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Initialize real-time listener
  initializeListener: () => {
    const pricingRef = doc(db, 'settings', 'pricing');
    
    const unsubscribe = onSnapshot(pricingRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          set({
            stall: { ...get().stall, ...data.stall },
            show: { ...get().show, ...data.show },
            syncStatus: 'connected',
            lastSync: new Date()
          });
        }
      },
      (error) => {
        console.error('Sync error:', error);
        set({ syncStatus: 'error' });
      }
    );

    set({ unsubscribe });
    return unsubscribe;
  },

  // Fetch all price settings
  fetchPriceSettings: async () => {
    set({ loading: true });
    try {
      // Fetch Stall pricing
      const stallRef = doc(db, 'settings', 'stallPricing');
      const stallSnap = await getDoc(stallRef);
      if (stallSnap.exists()) {
        set(state => ({ stall: { ...state.stall, ...stallSnap.data() } }));
      }

      // Fetch Show pricing
      const showRef = doc(db, 'settings', 'showPricing');
      const showSnap = await getDoc(showRef);
      if (showSnap.exists()) {
        set(state => ({ show: { ...state.show, ...showSnap.data() } }));
      }

      // Initialize real-time listener
      get().initializeListener();
    } catch (error) {
      console.error('Error fetching price settings:', error);
      toast.error('Failed to load price settings');
    } finally {
      set({ loading: false });
    }
  },

  // Save all settings
  saveSettings: async () => {
    const { admin } = useAdminAuthStore.getState();
    set({ saving: true });

    try {
      const { stall, show } = get();

      // Save Stall settings
      await setDoc(doc(db, 'settings', 'stallPricing'), {
        ...stall,
        updatedAt: new Date(),
        updatedBy: admin?.id
      });

      // Save Show settings
      await setDoc(doc(db, 'settings', 'showPricing'), {
        ...show,
        updatedAt: new Date(),
        updatedBy: admin?.id
      });

      // Save consolidated pricing for real-time sync
      await setDoc(doc(db, 'settings', 'pricing'), {
        stall, show,
        updatedAt: new Date(),
        updatedBy: admin?.id
      });

      // Log activity
      await get().logPriceChange('update', 'Price settings updated');

      toast.success('✅ Price settings updated successfully!');
      set({ saving: false });
      return { success: true };
    } catch (error) {
      console.error('Error saving price settings:', error);
      toast.error('Failed to save price settings');
      set({ saving: false });
      return { success: false };
    }
  },

  // Log price changes
  logPriceChange: async (action, details) => {
    const { admin } = useAdminAuthStore.getState();
    try {
      const { default: adminLogger } = await import('@/lib/adminLogger');
      await adminLogger.logSettingsActivity(
        admin,
        action,
        'pricing',
        details
      );
    } catch (error) {
      console.error('Error logging price change:', error);
    }
  },

  // Update Stall settings
  updateStall: (updates) => set(state => ({ 
    stall: { ...state.stall, ...updates } 
  })),

  // Update Stall seat price
  updateStallSeatPrice: (price) => set(state => ({
    stall: { ...state.stall, seatPrice: price }
  })),

  // Update Stall early bird discounts
  addStallEarlyBird: (discount) => {
    const { stall } = get();
    const newDiscount = {
      daysBeforeEvent: parseInt(discount.daysBeforeEvent),
      discountPercent: parseInt(discount.discountPercent),
      isActive: true
    };
    set({
      stall: {
        ...stall,
        earlyBirdDiscounts: [...stall.earlyBirdDiscounts, newDiscount]
      }
    });
  },

  removeStallEarlyBird: (index) => {
    const { stall } = get();
    set({
      stall: {
        ...stall,
        earlyBirdDiscounts: stall.earlyBirdDiscounts.filter((_, i) => i !== index)
      }
    });
  },

  toggleStallEarlyBird: (index, isActive) => {
    const { stall } = get();
    const updated = [...stall.earlyBirdDiscounts];
    updated[index].isActive = isActive;
    set({ stall: { ...stall, earlyBirdDiscounts: updated } });
  },

  // Update Stall bulk discounts
  addStallBulk: (discount) => {
    const { stall } = get();
    const newDiscount = {
      minSeats: parseInt(discount.minSeats),
      discountPercent: parseInt(discount.discountPercent),
      isActive: true
    };
    set({
      stall: {
        ...stall,
        bulkBookingDiscounts: [...stall.bulkBookingDiscounts, newDiscount]
      }
    });
  },

  removeStallBulk: (index) => {
    const { stall } = get();
    set({
      stall: {
        ...stall,
        bulkBookingDiscounts: stall.bulkBookingDiscounts.filter((_, i) => i !== index)
      }
    });
  },

  toggleStallBulk: (index, isActive) => {
    const { stall } = get();
    const updated = [...stall.bulkBookingDiscounts];
    updated[index].isActive = isActive;
    set({ stall: { ...stall, bulkBookingDiscounts: updated } });
  },

  // Update Show settings
  updateShow: (updates) => set(state => ({ 
    show: { ...state.show, ...updates } 
  })),

  // Update Show seat type price
  updateShowSeatType: (block, field, value) => set(state => ({
    show: {
      ...state.show,
      seatTypes: {
        ...state.show.seatTypes,
        [block]: { ...state.show.seatTypes[block], [field]: value }
      }
    }
  })),

  // Update Show early bird discounts
  addShowEarlyBird: (discount) => {
    const { show } = get();
    const newDiscount = {
      daysBeforeEvent: parseInt(discount.daysBeforeEvent),
      discountPercent: parseInt(discount.discountPercent),
      isActive: true
    };
    set({
      show: {
        ...show,
        earlyBirdDiscounts: [...show.earlyBirdDiscounts, newDiscount]
      }
    });
  },

  removeShowEarlyBird: (index) => {
    const { show } = get();
    set({
      show: {
        ...show,
        earlyBirdDiscounts: show.earlyBirdDiscounts.filter((_, i) => i !== index)
      }
    });
  },

  toggleShowEarlyBird: (index, isActive) => {
    const { show } = get();
    const updated = [...show.earlyBirdDiscounts];
    updated[index].isActive = isActive;
    set({ show: { ...show, earlyBirdDiscounts: updated } });
  },

  // Update Show bulk discounts
  addShowBulk: (discount) => {
    const { show } = get();
    const newDiscount = {
      minSeats: parseInt(discount.minSeats),
      discountPercent: parseInt(discount.discountPercent),
      isActive: true
    };
    set({
      show: {
        ...show,
        bulkBookingDiscounts: [...show.bulkBookingDiscounts, newDiscount]
      }
    });
  },

  removeShowBulk: (index) => {
    const { show } = get();
    set({
      show: {
        ...show,
        bulkBookingDiscounts: show.bulkBookingDiscounts.filter((_, i) => i !== index)
      }
    });
  },

  toggleShowBulk: (index, isActive) => {
    const { show } = get();
    const updated = [...show.bulkBookingDiscounts];
    updated[index].isActive = isActive;
    set({ show: { ...show, bulkBookingDiscounts: updated } });
  },

  // Cleanup listener
  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  // Reset store
  reset: () => set({
    loading: true,
    saving: false,
    syncStatus: 'connected',
    lastSync: null,
    activeTab: 'stall',
    stall: {
      seatPrice: 5000,
      earlyBirdDiscounts: [{ daysBeforeEvent: 30, discountPercent: 25, isActive: true }],
      bulkBookingDiscounts: [{ minSeats: 2, discountPercent: 10, isActive: true }]
    },
    show: {
      seatTypes: {
        blockA: { price: 1200, label: 'Block A Premium' },
        blockB: { price: 1000, label: 'Block B Premium' },
        blockC: { price: 600, label: 'Block C Regular' },
        blockD: { price: 400, label: 'Block D Regular' }
      },
      earlyBirdDiscounts: [
        { daysBeforeEvent: 30, discountPercent: 20, isActive: true },
        { daysBeforeEvent: 7, discountPercent: 10, isActive: true }
      ],
      bulkBookingDiscounts: [
        { minSeats: 5, discountPercent: 10, isActive: true },
        { minSeats: 10, discountPercent: 15, isActive: true }
      ]
    }
  })
}));

export default usePriceStore;