// stores/admin/useSystemSettingsStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useAdminAuthStore from './useAdminAuthStore';
import adminLogger from '@/lib/adminLogger';
import {
  DEFAULT_PREMIUM_BLOCKS,
  DEFAULT_REGULAR_BLOCKS,
  normalizeShowSettings,
  sanitizeBlockId
} from '@/utils/showSeatUtils';

const useSystemSettingsStore = create((set, get) => ({
  // State
  loading: true,
  saving: false,
  activeTab: 'stall',

  // Stall Settings
  stallSettings: {
    eventDates: {
      startDate: '2025-11-15',
      endDate: '2025-11-20',
      isActive: true
    },
    totalStalls: 70,
    defaultPrice: 5000,
    stalls: []
  },

  // Show Settings
  showSettings: {
    eventDates: {
      startDate: '',
      endDate: '',
      isActive: false,
      availableDays: 5
    },
    shows: [],
    seatLayout: {
      premiumBlocks: DEFAULT_PREMIUM_BLOCKS,
      regularBlocks: DEFAULT_REGULAR_BLOCKS
    }
  },

  // UI States
  editingShow: null,
  dateValidationErrors: { startDate: '', endDate: '' },

  // Icon options
  iconOptions: ['🌅', '🌆', '🌙', '☀️', '⭐', '🔥', '🕉️', '🙏', '🎭', '🎪'],

  // New show template
  newShow: {
    id: '',
    name: '',
    timeFrom: '',
    timeTo: '',
    description: '',
    icon: '🎭',
    badgeText: '',
    isActive: true
  },

  // Initialize
  initialize: async () => {
    set({ loading: true });
    await get().fetchSystemSettings();
  },

  // Fetch all settings
  fetchSystemSettings: async () => {
    try {
      // Fetch stall settings
      const stallRef = doc(db, 'settings', 'stalls');
      const stallSnap = await getDoc(stallRef);
      if (stallSnap.exists()) {
        const data = stallSnap.data();
        set({ stallSettings: data });
        
        // Generate stalls if empty
        if (data.stalls?.length === 0) {
          get().generateAllStalls();
        }
      } else {
        // Initialize with default stalls
        get().generateAllStalls();
      }

      // Fetch show settings
      const showRef = doc(db, 'settings', 'shows');
      const showSnap = await getDoc(showRef);
      if (showSnap.exists()) {
        set({ showSettings: normalizeShowSettings(showSnap.data()) });
      }

    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      set({ loading: false });
    }
  },

  // Save all settings
  saveSettings: async () => {
    const { admin } = useAdminAuthStore.getState();
    set({ saving: true });

    try {
      const { stallSettings, showSettings } = get();

      // Validate stall event dates
      if (stallSettings.eventDates.isActive) {
        const errors = get().validateDateRange(
          stallSettings.eventDates.startDate,
          stallSettings.eventDates.endDate
        );
        if (errors.startDate || errors.endDate) {
          set({ dateValidationErrors: errors });
          toast.error('Please fix date validation errors');
          set({ saving: false });
          return;
        }
      }

      // Save stall settings
      await setDoc(doc(db, 'settings', 'stalls'), {
        ...stallSettings,
        updatedAt: serverTimestamp(),
        updatedBy: admin?.id
      });

      // Save show settings
      await setDoc(doc(db, 'settings', 'shows'), {
        ...normalizeShowSettings(showSettings),
        updatedAt: serverTimestamp(),
        updatedBy: admin?.id
      });

      // Log activity
      await adminLogger.logSettingsActivity(
        admin,
        'update',
        'system',
        'Updated system settings (stalls & shows)'
      );

      toast.success('✅ System settings updated successfully!');
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast.error('Failed to save system settings');
    } finally {
      set({ saving: false });
    }
  },

  // Set active tab
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Date validation
  validateDateRange: (startDate, endDate) => {
    const errors = { startDate: '', endDate: '' };

    if (!startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!endDate) {
      errors.endDate = 'End date is required';
    }

    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T00:00:00`) : null;

    if (startDate && Number.isNaN(start?.getTime())) {
      errors.startDate = 'Invalid start date';
    }

    if (endDate && Number.isNaN(end?.getTime())) {
      errors.endDate = 'Invalid end date';
    }

    if (!errors.startDate && !errors.endDate && start && end && end <= start) {
      errors.endDate = 'End date must be after start date';
    }

    return errors;
  },

  // ========== STALL SETTINGS METHODS ==========

  // Generate all stalls
  generateAllStalls: () => {
    const { stallSettings } = get();
    const stalls = [];
    for (let i = 1; i <= stallSettings.totalStalls; i++) {
      stalls.push({
        id: `S${i}`,
        name: `Stall S${i}`,
        size: '10x10 ft',
        price: stallSettings.defaultPrice,
        isActive: true
      });
    }
    
    set({
      stallSettings: {
        ...stallSettings,
        stalls
      }
    });
  },

  // Update stall total count
  updateStallTotal: (total) => {
    set(state => ({
      stallSettings: {
        ...state.stallSettings,
        totalStalls: total
      }
    }));
  },

  // Update stall default price
  updateStallDefaultPrice: (price) => {
    set(state => ({
      stallSettings: {
        ...state.stallSettings,
        defaultPrice: price
      }
    }));
  },

  // Update stall event dates
  updateStallEventDates: (field, value) => {
    set(state => ({
      stallSettings: {
        ...state.stallSettings,
        eventDates: {
          ...state.stallSettings.eventDates,
          [field]: value
        }
      }
    }));

    // Validate if both dates are set
    const { stallSettings } = get();
    if (stallSettings.eventDates.startDate && stallSettings.eventDates.endDate) {
      const errors = get().validateDateRange(
        stallSettings.eventDates.startDate,
        stallSettings.eventDates.endDate
      );
      set({ dateValidationErrors: errors });
    }
  },

  // Toggle stall event dates active
  toggleStallEventDates: (isActive) => {
    set(state => ({
      stallSettings: {
        ...state.stallSettings,
        eventDates: {
          ...state.stallSettings.eventDates,
          isActive
        }
      }
    }));
  },

  // Toggle stall active status
  toggleStallActive: (index) => {
    set(state => {
      const updatedStalls = [...state.stallSettings.stalls];
      updatedStalls[index].isActive = !updatedStalls[index].isActive;
      return {
        stallSettings: {
          ...state.stallSettings,
          stalls: updatedStalls
        }
      };
    });
  },

  // Update stall price
  updateStallPrice: (index, price) => {
    set(state => {
      const updatedStalls = [...state.stallSettings.stalls];
      updatedStalls[index].price = price;
      return {
        stallSettings: {
          ...state.stallSettings,
          stalls: updatedStalls
        }
      };
    });
  },

  // Remove stall
  removeStall: (index) => {
    set(state => {
      const updatedStalls = state.stallSettings.stalls.filter((_, i) => i !== index);
      toast.success('Stall removed successfully');
      return {
        stallSettings: {
          ...state.stallSettings,
          stalls: updatedStalls
        }
      };
    });
  },

  // Add individual stall
  addIndividualStall: (price) => {
    set(state => {
      const nextNumber = state.stallSettings.stalls.length + 1;
      const id = `S${nextNumber}`;
      
      // Check if already exists
      if (state.stallSettings.stalls.some(s => s.id === id)) {
        toast.error('Stall ID already exists');
        return state;
      }

      const newStall = {
        id,
        name: `Stall S${nextNumber}`,
        size: '10x10 ft',
        price: price || state.stallSettings.defaultPrice,
        isActive: true
      };

      toast.success(`Stall ${id} added successfully!`);
      
      return {
        stallSettings: {
          ...state.stallSettings,
          stalls: [...state.stallSettings.stalls, newStall]
        }
      };
    });
  },

  // ========== SHOW SETTINGS METHODS ==========

  // Update show event dates
  updateShowEventDates: (field, value) => {
    set(state => ({
      showSettings: {
        ...state.showSettings,
        eventDates: {
          ...state.showSettings.eventDates,
          [field]: value
        }
      }
    }));
  },

  // Toggle show event dates active
  toggleShowEventDates: (isActive) => {
    set(state => ({
      showSettings: {
        ...state.showSettings,
        eventDates: {
          ...state.showSettings.eventDates,
          isActive
        }
      }
    }));
  },

  // Update show available days
  updateShowAvailableDays: (days) => {
    set(state => ({
      showSettings: {
        ...state.showSettings,
        eventDates: {
          ...state.showSettings.eventDates,
          availableDays: days
        }
      }
    }));
  },

  // Update premium block
  updatePremiumBlock: (index, field, value) => {
    set(state => {
      const updatedBlocks = [...state.showSettings.seatLayout.premiumBlocks];
      updatedBlocks[index][field] = value;
      return {
        showSettings: {
          ...state.showSettings,
          seatLayout: {
            ...state.showSettings.seatLayout,
            premiumBlocks: updatedBlocks
          }
        }
      };
    });
  },

  addPremiumBlock: (block) => {
    const blockId = sanitizeBlockId(block?.id);
    if (!blockId) {
      toast.error('Block ID is required');
      return false;
    }

    const showSettings = normalizeShowSettings(get().showSettings);
    const exists = [...showSettings.seatLayout.premiumBlocks, ...showSettings.seatLayout.regularBlocks]
      .some((item) => item.id === blockId);

    if (exists) {
      toast.error(`Block ${blockId} already exists`);
      return false;
    }

    const newBlock = {
      id: blockId,
      name: block?.name || `Block ${blockId}`,
      maxRows: Math.max(1, Number(block?.maxRows) || 1),
      maxPairsPerRow: Math.max(1, Number(block?.maxPairsPerRow) || 1),
      price: Number(block?.price) || 0,
      isActive: block?.isActive !== false,
      type: 'premium'
    };

    set(state => ({
      showSettings: {
        ...state.showSettings,
        seatLayout: {
          ...state.showSettings.seatLayout,
          premiumBlocks: [...state.showSettings.seatLayout.premiumBlocks, newBlock]
        }
      }
    }));
    toast.success(`Added premium block ${blockId}`);
    return true;
  },

  // Toggle premium block active
  togglePremiumBlockActive: (index) => {
    set(state => {
      const updatedBlocks = [...state.showSettings.seatLayout.premiumBlocks];
      updatedBlocks[index].isActive = !updatedBlocks[index].isActive;
      return {
        showSettings: {
          ...state.showSettings,
          seatLayout: {
            ...state.showSettings.seatLayout,
            premiumBlocks: updatedBlocks
          }
        }
      };
    });
  },

  // Update regular block
  updateRegularBlock: (index, field, value) => {
    set(state => {
      const updatedBlocks = [...state.showSettings.seatLayout.regularBlocks];
      updatedBlocks[index][field] = value;
      return {
        showSettings: {
          ...state.showSettings,
          seatLayout: {
            ...state.showSettings.seatLayout,
            regularBlocks: updatedBlocks
          }
        }
      };
    });
  },

  addRegularBlock: (block) => {
    const blockId = sanitizeBlockId(block?.id);
    if (!blockId) {
      toast.error('Block ID is required');
      return false;
    }

    const showSettings = normalizeShowSettings(get().showSettings);
    const exists = [...showSettings.seatLayout.premiumBlocks, ...showSettings.seatLayout.regularBlocks]
      .some((item) => item.id === blockId);

    if (exists) {
      toast.error(`Block ${blockId} already exists`);
      return false;
    }

    const newBlock = {
      id: blockId,
      name: block?.name || `Block ${blockId}`,
      maxRows: Math.max(1, Number(block?.maxRows) || 1),
      maxSeatsPerRow: Math.max(1, Number(block?.maxSeatsPerRow) || 1),
      price: Number(block?.price) || 0,
      isActive: block?.isActive !== false,
      type: 'regular'
    };

    set(state => ({
      showSettings: {
        ...state.showSettings,
        seatLayout: {
          ...state.showSettings.seatLayout,
          regularBlocks: [...state.showSettings.seatLayout.regularBlocks, newBlock]
        }
      }
    }));
    toast.success(`Added regular block ${blockId}`);
    return true;
  },

  // Toggle regular block active
  toggleRegularBlockActive: (index) => {
    set(state => {
      const updatedBlocks = [...state.showSettings.seatLayout.regularBlocks];
      updatedBlocks[index].isActive = !updatedBlocks[index].isActive;
      return {
        showSettings: {
          ...state.showSettings,
          seatLayout: {
            ...state.showSettings.seatLayout,
            regularBlocks: updatedBlocks
          }
        }
      };
    });
  },

  removePremiumBlock: (index) => {
    set(state => ({
      showSettings: {
        ...state.showSettings,
        seatLayout: {
          ...state.showSettings.seatLayout,
          premiumBlocks: state.showSettings.seatLayout.premiumBlocks.filter((_, currentIndex) => currentIndex !== index)
        }
      }
    }));
    toast.success('Premium block removed');
  },

  removeRegularBlock: (index) => {
    set(state => ({
      showSettings: {
        ...state.showSettings,
        seatLayout: {
          ...state.showSettings.seatLayout,
          regularBlocks: state.showSettings.seatLayout.regularBlocks.filter((_, currentIndex) => currentIndex !== index)
        }
      }
    }));
    toast.success('Regular block removed');
  },

  // Update new show field
  updateNewShow: (field, value) => {
    set(state => ({
      newShow: {
        ...state.newShow,
        [field]: value
      }
    }));
  },

  // Reset new show
  resetNewShow: () => {
    set({
      newShow: {
        id: '',
        name: '',
        timeFrom: '',
        timeTo: '',
        description: '',
        icon: '🎭',
        badgeText: '',
        isActive: true
      }
    });
  },

  // Add show timing
  addShowTiming: () => {
    const { newShow, showSettings } = get();
    
    if (!newShow.id || !newShow.name || !newShow.timeFrom || !newShow.timeTo) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (showSettings.shows.some(show => show.id === newShow.id)) {
      toast.error('Show ID already exists');
      return false;
    }

    set(state => ({
      showSettings: {
        ...state.showSettings,
        shows: [...state.showSettings.shows, { ...newShow }]
      }
    }));

    get().resetNewShow();
    toast.success('Show timing added successfully');
    return true;
  },

  // Remove show timing
  removeShowTiming: (index) => {
    set(state => {
      const updatedShows = state.showSettings.shows.filter((_, i) => i !== index);
      toast.success('Show timing removed successfully');
      return {
        showSettings: {
          ...state.showSettings,
          shows: updatedShows
        }
      };
    });
  },

  // Toggle show active
  toggleShowActive: (index) => {
    set(state => {
      const updatedShows = [...state.showSettings.shows];
      updatedShows[index].isActive = !updatedShows[index].isActive;
      return {
        showSettings: {
          ...state.showSettings,
          shows: updatedShows
        }
      };
    });
  },

  // Set editing show
  setEditingShow: (index) => set({ editingShow: index }),

  // Clear validation errors
  clearValidationErrors: () => set({ dateValidationErrors: { startDate: '', endDate: '' } }),

  // Reset
  reset: () => set({
    loading: true,
    saving: false,
    activeTab: 'stall',
    stallSettings: {
      eventDates: { startDate: '2025-11-15', endDate: '2025-11-20', isActive: true },
      totalStalls: 70,
      defaultPrice: 5000,
      stalls: []
    },
    showSettings: {
      eventDates: { startDate: '', endDate: '', isActive: false, availableDays: 5 },
      shows: [],
      seatLayout: {
        premiumBlocks: DEFAULT_PREMIUM_BLOCKS,
        regularBlocks: DEFAULT_REGULAR_BLOCKS
      }
    },
    editingShow: null,
    dateValidationErrors: { startDate: '', endDate: '' },
    newShow: {
      id: '',
      name: '',
      timeFrom: '',
      timeTo: '',
      description: '',
      icon: '🎭',
      badgeText: '',
      isActive: true
    }
  })
}));

export default useSystemSettingsStore;
