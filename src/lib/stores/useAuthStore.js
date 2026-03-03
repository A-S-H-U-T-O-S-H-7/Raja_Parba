import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const buildUserProfile = (user, overrides = {}) => ({
  uid: user.uid,
  email: user.email || '',
  displayName: overrides.displayName || user.displayName || user.email?.split('@')?.[0] || 'User',
  photoURL: user.photoURL || null,
  emailVerified: Boolean(user.emailVerified),
  phone: user.phoneNumber || null,
  address: null,
  createdAt: new Date(),
  lastLoginAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  role: 'user',
  signInMethod: overrides.signInMethod || 'email',
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    language: 'en'
  },
  totalBookings: 0,
  totalSpent: 0,
  bookings: []
});

const ensureUserProfile = async (user, signInMethod = 'email') => {
  if (!user?.uid) return;

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, buildUserProfile(user, { signInMethod }));
    return;
  }

  const existing = userDoc.data() || {};
  await updateDoc(userRef, {
    email: user.email || existing.email || '',
    displayName: user.displayName || existing.displayName || 'User',
    photoURL: user.photoURL || existing.photoURL || null,
    emailVerified: Boolean(user.emailVerified),
    signInMethod: signInMethod || existing.signInMethod || 'email',
    lastLoginAt: new Date(),
    updatedAt: new Date()
  });
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,
      unsubscribe: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      signUp: async (email, password, name) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.signUp(email, password);
          if (!result.success || !result.user) {
            set({ error: result.error, loading: false, user: null });
            return { success: false, error: result.error };
          }

          await setDoc(
            doc(db, 'users', result.user.uid),
            buildUserProfile(result.user, {
              signInMethod: 'email',
              displayName: name || email.split('@')[0]
            })
          );

          set({ user: result.user, loading: false, error: null });
          return { success: true, user: result.user };
        } catch (error) {
          console.error('Signup error:', error);
          set({ error: error.message, loading: false, user: null });
          return { success: false, error: error.message };
        }
      },

      signIn: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.signIn(email, password);
          if (!result.success || !result.user) {
            set({ error: result.error, loading: false, user: null });
            return { success: false, error: result.error };
          }

          await ensureUserProfile(result.user, 'email');
          set({ user: result.user, loading: false, error: null });
          return { success: true, user: result.user };
        } catch (error) {
          set({ error: error.message, loading: false, user: null });
          return { success: false, error: error.message };
        }
      },

      signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const result = await authService.signInWithGoogle();
          if (!result.success || !result.user) {
            set({ error: result.error, loading: false, user: null });
            return { success: false, error: result.error };
          }

          await ensureUserProfile(result.user, 'google');
          set({ user: result.user, loading: false, error: null });
          return { success: true, user: result.user };
        } catch (error) {
          set({ error: error.message, loading: false, user: null });
          return { success: false, error: error.message };
        }
      },

      sendPasswordReset: async (email) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.sendPasswordReset(email);
          set({ loading: false });
          if (!result.success) {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      confirmPasswordReset: async (oobCode, newPassword) => {
        set({ loading: true, error: null });
        try {
          const result = await authService.confirmPasswordReset(oobCode, newPassword);
          set({ loading: false });
          if (!result.success) {
            set({ error: result.error });
            return { success: false, error: result.error };
          }
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          const result = await authService.signOut();
          if (!result.success) {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }

          set({ user: null, loading: false, error: null });
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false, user: null });
          return { success: false, error: error.message };
        }
      },

      initializeAuthListener: () => {
        if (get().unsubscribe) return get().unsubscribe;

        const unsubscribe = authService.onAuthStateChange(async (user) => {
          if (user) {
            const providerId = user.providerData?.[0]?.providerId || '';
            const signInMethod = providerId.includes('google') ? 'google' : 'email';
            try {
              await ensureUserProfile(user, signInMethod);
            } catch (profileError) {
              console.error('Failed to sync user profile on auth state change:', profileError);
            }
          }

          set({ user, loading: false });
        });

        set({ unsubscribe });
        return unsubscribe;
      },

      clearError: () => set({ error: null }),

      reset: () => set({
        user: null,
        loading: false,
        error: null
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);

if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuthListener();
}

export default useAuthStore;
