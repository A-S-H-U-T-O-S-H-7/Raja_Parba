// stores/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/firebase/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      loading: true,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),

      // Sign up
      signUp: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.signUp(email, password);
          if (result.success) {
            set({ 
              user: result.user,
              loading: false,
              error: null 
            });
            return { success: true };
          } else {
            set({ 
              error: result.error,
              loading: false,
              user: null
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false,
            user: null
          });
          return { success: false, error: error.message };
        }
      },

      // Login
      signIn: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.signIn(email, password);
          if (result.success) {
            set({ 
              user: result.user,
              loading: false,
              error: null 
            });
            return { success: true };
          } else {
            set({ 
              error: result.error,
              loading: false,
              user: null
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false,
            user: null
          });
          return { success: false, error: error.message };
        }
      },

      // Google Sign In
      signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const result = await authService.signInWithGoogle();
          if (result.success) {
            set({ 
              user: result.user,
              loading: false,
              error: null 
            });
            return { success: true };
          } else {
            set({ 
              error: result.error,
              loading: false,
              user: null
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false,
            user: null
          });
          return { success: false, error: error.message };
        }
      },

      // Send Password Reset
      sendPasswordReset: async (email) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.sendPasswordReset(email);
          set({ loading: false });
          if (result.success) {
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Confirm Password Reset
      confirmPasswordReset: async (oobCode, newPassword) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.confirmPasswordReset(oobCode, newPassword);
          set({ loading: false });
          if (result.success) {
            return { success: true };
          } else {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Sign Out
      signOut: async () => {
        set({ loading: true });
        try {
          const result = await authService.signOut();
          if (result.success) {
            set({ 
              user: null,
              loading: false,
              error: null 
            });
            return { success: true };
          } else {
            set({ 
              error: result.error,
              loading: false 
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false,
            user: null 
          });
          return { success: false, error: error.message };
        }
      },

      // Initialize auth state listener
      initializeAuthListener: () => {
        // Check if already initialized
        if (get().unsubscribe) return;
        
        const unsubscribe = authService.onAuthStateChange((user) => {
          set({ 
            user, 
            loading: false 
          });
        });
        
        // Store unsubscribe function
        set({ unsubscribe });
        
        return unsubscribe;
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () => set({ 
        user: null, 
        loading: false, 
        error: null 
      })
    }),
    {
      name: 'auth-storage', // name for localStorage
      partialize: (state) => ({ 
        // Only persist user, not loading/error states
        user: state.user 
      }),
    }
  )
);

// Initialize auth listener outside of React
if (typeof window !== 'undefined') {
  // This will run once when the store is imported
  useAuthStore.getState().initializeAuthListener();
}

export default useAuthStore;