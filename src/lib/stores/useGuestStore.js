import { create } from 'zustand';
import { getGuests as getPublicGuestsFromService, getAllDistinguishedGuests } from '@/lib/distinguishedGuestsService';

const useGuestStore = create((set) => ({
  publicGuests: [],
  adminGuests: [],
  loading: false,
  error: null,

  fetchPublicGuests: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const result = await getPublicGuestsFromService(filters);
      if (!result.success) {
        set({ loading: false, error: result.error || 'Failed to load guests', publicGuests: [] });
        return { success: false, data: [], error: result.error };
      }

      set({ loading: false, error: null, publicGuests: result.data || [] });
      return { success: true, data: result.data || [] };
    } catch (error) {
      set({ loading: false, error: error.message || 'Failed to load guests', publicGuests: [] });
      return { success: false, data: [], error: error.message };
    }
  },

  fetchAdminGuests: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const result = await getAllDistinguishedGuests(filters);
      if (!result.success) {
        set({ loading: false, error: result.error || 'Failed to load guests', adminGuests: [] });
        return { success: false, data: [], error: result.error };
      }

      set({ loading: false, error: null, adminGuests: result.data || [] });
      return { success: true, data: result.data || [] };
    } catch (error) {
      set({ loading: false, error: error.message || 'Failed to load guests', adminGuests: [] });
      return { success: false, data: [], error: error.message };
    }
  }
}));

export default useGuestStore;
