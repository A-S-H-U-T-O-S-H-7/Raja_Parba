// stores/useAdminStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminService } from '@/lib/firebase/admin';
import { authService } from '@/lib/firebase/auth';
import useAuthStore from './useAuthStore';

const useAdminStore = create(
  persist(
    (set, get) => ({
      // State
      adminUser: null,
      adminData: null,
      loading: true,
      error: null,
      isAdmin: false,
      isSuperAdmin: false,
      unsubscribe: null,

      // Actions
      setAdminUser: (adminUser) => set({ 
        adminUser,
        isAdmin: !!adminUser,
        isSuperAdmin: adminUser?.role === 'super_admin'
      }),

      setAdminData: (adminData) => set({ adminData }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),

      // Initialize admin listener
      initializeAdminListener: async () => {
        // Clean up existing listener
        if (get().unsubscribe) {
          get().unsubscribe();
        }

        // Get current user from auth store
        const authUser = useAuthStore.getState().user;
        
        if (!authUser) {
          set({ 
            adminUser: null, 
            adminData: null, 
            loading: false,
            isAdmin: false,
            isSuperAdmin: false 
          });
          return;
        }

        set({ loading: true });

        try {
          // Check if user is admin
          const adminCheck = await adminService.checkAdminStatus(
            authUser.uid, 
            authUser.email
          );

          if (adminCheck.isAdmin) {
            const formattedAdmin = adminService.formatAdminUser(
              authUser, 
              adminCheck.data
            );

            set({
              adminUser: formattedAdmin,
              adminData: adminCheck.data,
              isAdmin: true,
              isSuperAdmin: formattedAdmin?.role === 'super_admin',
              loading: false,
              error: null
            });

            // Set up real-time listener for admin data
            const unsubscribe = adminService.subscribeToAdmin(
              authUser.uid,
              (result) => {
                if (result.exists) {
                  const formattedAdmin = adminService.formatAdminUser(
                    authUser,
                    result.data
                  );
                  set({
                    adminUser: formattedAdmin,
                    adminData: result.data,
                    isAdmin: true,
                    isSuperAdmin: formattedAdmin?.role === 'super_admin'
                  });
                } else {
                  // Admin document deleted - revoke access
                  set({
                    adminUser: null,
                    adminData: null,
                    isAdmin: false,
                    isSuperAdmin: false
                  });
                }
              }
            );

            set({ unsubscribe });
          } else {
            set({ 
              adminUser: null, 
              adminData: null, 
              loading: false,
              isAdmin: false,
              isSuperAdmin: false,
              error: null
            });
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false,
            adminUser: null,
            adminData: null,
            isAdmin: false,
            isSuperAdmin: false
          });
        }
      },

      // Admin logout
      adminLogout: async () => {
        set({ loading: true });
        try {
          const result = await authService.signOut();
          if (result.success) {
            set({ 
              adminUser: null,
              adminData: null,
              loading: false,
              isAdmin: false,
              isSuperAdmin: false,
              error: null
            });
            
            // Also clear auth store
            useAuthStore.getState().setUser(null);
            
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
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Check permission
      hasPermission: (permission) => {
        const { adminUser, isSuperAdmin } = get();
        if (!adminUser) return false;
        if (isSuperAdmin) return true;
        return adminUser.permissions?.includes(permission) || false;
      },

      // Update admin data
      updateAdminData: async (updates) => {
        const { adminUser } = get();
        if (!adminUser) {
          return { success: false, error: 'No admin user found' };
        }

        set({ loading: true });
        try {
          const result = await adminService.updateAdminRecord(
            adminUser.uid,
            updates
          );

          if (result.success) {
            // The real-time listener will update the state
            set({ loading: false, error: null });
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
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () => set({ 
        adminUser: null,
        adminData: null,
        loading: false,
        error: null,
        isAdmin: false,
        isSuperAdmin: false
      }),

      // Cleanup listener
      cleanup: () => {
        const { unsubscribe } = get();
        if (unsubscribe) {
          unsubscribe();
          set({ unsubscribe: null });
        }
      }
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        adminUser: state.adminUser,
        isAdmin: state.isAdmin,
        isSuperAdmin: state.isSuperAdmin
      }),
    }
  )
);

// Auto-initialize when auth user changes
if (typeof window !== 'undefined') {
  // Subscribe to auth store changes
  useAuthStore.subscribe(
    (state) => state.user,
    (user) => {
      if (user) {
        useAdminStore.getState().initializeAdminListener();
      } else {
        useAdminStore.getState().reset();
      }
    },
    { fireImmediately: true }
  );
}

export default useAdminStore;