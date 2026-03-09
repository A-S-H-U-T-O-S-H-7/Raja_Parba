// stores/admin/useAdminAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminAuthService } from '../admin/auth';
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

      // Admin login
      adminLogin: async (username, password) => {
        set({ loading: true, error: null });
        
        try {
          console.log('🔐 Attempting admin login for:', username);
          const result = await adminAuthService.login(username, password);
          
          if (result.success) {
            const normalizedAdmin = {
              ...result.admin,
              uid: result.admin?.uid || result.admin?.id
            };
            
            // Store session in cookie
            Cookies.set('admin_session', result.sessionToken, { 
              expires: 1,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/'
            });
            
            set({ 
              admin: normalizedAdmin,
              sessionToken: result.sessionToken,
              isAuthenticated: true,
              loading: false,
              error: null 
            });
            
            return { success: true };
          } else {
            console.log('❌ Admin login failed:', result.error);
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
          console.error('🔥 Admin login error:', error);
          set({ 
            error: error.message || 'Login failed',
            loading: false,
            admin: null,
            sessionToken: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Verify session
      verifySession: async () => {
        const tokenFromCookie = Cookies.get('admin_session');
        const sessionToken = tokenFromCookie || get().sessionToken;
        
        if (!sessionToken) {
          set({ isAuthenticated: false, admin: null });
          return { success: false };
        }

        set({ loading: true });
        
        try {
          const result = await adminAuthService.verifySession(sessionToken);
          
          if (result.success) {
            const normalizedAdmin = {
              ...result.admin,
              uid: result.admin?.uid || result.admin?.id
            };

            // Keep cookie in sync for browsers with strict cookie behavior.
            if (!tokenFromCookie) {
              Cookies.set('admin_session', sessionToken, {
                expires: 1,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
              });
            }
            set({ 
              admin: normalizedAdmin,
              sessionToken,
              isAuthenticated: true,
              loading: false,
              error: null 
            });
            return { success: true };
          } else {
            Cookies.remove('admin_session');
            set({ 
              admin: null,
              sessionToken: null,
              isAuthenticated: false,
              loading: false,
              error: result.error 
            });
            return { success: false };
          }
        } catch (error) {
          console.error('Session verification error:', error);
          Cookies.remove('admin_session');
          set({ 
            admin: null,
            sessionToken: null,
            isAuthenticated: false,
            loading: false 
          });
          return { success: false };
        }
      },

      // Logout
      adminLogout: async () => {
        const { sessionToken } = get();
        
        if (sessionToken) {
          try {
            await adminAuthService.logout(sessionToken);
          } catch (error) {
            console.error('Logout error:', error);
          }
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

      // Permission checks
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

      hasRole: (role) => {
        const { admin } = get();
        if (!admin) return false;
        return admin.role === role;
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
        admin: state.admin ? {
          id: state.admin.id,
          uid: state.admin.uid || state.admin.id,
          username: state.admin.username,
          name: state.admin.name,
          role: state.admin.role,
          permissions: state.admin.permissions
        } : null,
        sessionToken: state.sessionToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Auto-verify session
if (typeof window !== 'undefined') {
  useAdminAuthStore.getState().verifySession();
}

export default useAdminAuthStore;
