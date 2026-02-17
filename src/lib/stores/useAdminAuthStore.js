// stores/useAdminAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthService } from '@/lib/admin/auth';
import Cookies from 'js-cookie'; 

const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      // State
      admin: null,
      sessionToken: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Admin login (custom credentials)
      adminLogin: async (username, password) => {
        set({ loading: true, error: null });
        
        try {
          const result = await adminAuthService.login(username, password);
          
          if (result.success) {
            // Store session token in httpOnly cookie (set via API) or localStorage
            // For now using js-cookie
            Cookies.set('admin_session', result.sessionToken, { 
              expires: 1, // 1 day
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
            
            set({ 
              admin: result.admin,
              sessionToken: result.sessionToken,
              isAuthenticated: true,
              loading: false,
              error: null 
            });
            
            return { success: true };
          } else {
            set({ 
              error: result.error,
              loading: false,
              admin: null,
              sessionToken: null,
              isAuthenticated: false
            });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ 
            error: error.message,
            loading: false,
            admin: null,
            sessionToken: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Admin logout
      adminLogout: async () => {
        const { sessionToken } = get();
        
        if (sessionToken) {
          await adminAuthService.logout(sessionToken);
          Cookies.remove('admin_session');
        }
        
        set({ 
          admin: null,
          sessionToken: null,
          isAuthenticated: false,
          loading: false,
          error: null 
        });
        
        return { success: true };
      },

      // Verify session on app load
      verifySession: async () => {
        const sessionToken = Cookies.get('admin_session');
        
        if (!sessionToken) {
          set({ isAuthenticated: false, admin: null });
          return { success: false };
        }

        set({ loading: true });
        
        const result = await adminAuthService.verifySession(sessionToken);
        
        if (result.success) {
          set({ 
            admin: result.admin,
            sessionToken,
            isAuthenticated: true,
            loading: false,
            error: null 
          });
          return { success: true, admin: result.admin };
        } else {
          Cookies.remove('admin_session');
          set({ 
            admin: null,
            sessionToken: null,
            isAuthenticated: false,
            loading: false,
            error: result.error 
          });
          return { success: false, error: result.error };
        }
      },

      // Role & Permission Checks
      hasRole: (role) => {
        const { admin } = get();
        if (!admin) return false;
        if (admin.role === 'super_admin') return true;
        return admin.role === role;
      },

      hasPermission: (permission) => {
        const { admin } = get();
        if (!admin) return false;
        if (admin.role === 'super_admin') return true;
        return admin.permissions?.includes(permission) || false;
      },

      hasAnyPermission: (permissions) => {
        const { admin } = get();
        if (!admin) return false;
        if (admin.role === 'super_admin') return true;
        return permissions.some(p => admin.permissions?.includes(p));
      },

      hasAllPermissions: (permissions) => {
        const { admin } = get();
        if (!admin) return false;
        if (admin.role === 'super_admin') return true;
        return permissions.every(p => admin.permissions?.includes(p));
      },

      // Admin management (super admin only)
      createAdmin: async (adminData) => {
        const { admin } = get();
        if (admin?.role !== 'super_admin') {
          return { success: false, error: 'Unauthorized' };
        }

        set({ loading: true });
        const result = await adminAuthService.createAdmin({
          ...adminData,
          createdBy: admin.id
        });
        set({ loading: false });
        
        return result;
      },

      updateAdmin: async (adminId, updates) => {
        const { admin } = get();
        if (admin?.role !== 'super_admin' && admin?.id !== adminId) {
          return { success: false, error: 'Unauthorized' };
        }

        set({ loading: true });
        const result = await adminAuthService.updateAdmin(adminId, updates, admin.id);
        set({ loading: false });
        
        return result;
      },

      deleteAdmin: async (adminId) => {
        const { admin } = get();
        if (admin?.role !== 'super_admin') {
          return { success: false, error: 'Unauthorized' };
        }

        set({ loading: true });
        const result = await adminAuthService.deleteAdmin(adminId, admin.id);
        set({ loading: false });
        
        return result;
      },

      getAllAdmins: async () => {
        const { admin } = get();
        if (admin?.role !== 'super_admin') {
          return { success: false, admins: [], error: 'Unauthorized' };
        }

        set({ loading: true });
        const result = await adminAuthService.getAllAdmins();
        set({ loading: false });
        
        return result;
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      reset: () => set({ 
        admin: null,
        sessionToken: null,
        loading: false,
        error: null,
        isAuthenticated: false 
      })
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ 
        // Only persist non-sensitive data
        admin: state.admin ? {
          id: state.admin.id,
          username: state.admin.username,
          name: state.admin.name,
          role: state.admin.role,
          permissions: state.admin.permissions
        } : null,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Auto-verify session on store initialization
if (typeof window !== 'undefined') {
  useAdminAuthStore.getState().verifySession();
}

export default useAdminAuthStore;