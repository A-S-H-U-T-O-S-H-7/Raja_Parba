// stores/admin/useUserStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const useUserStore = create((set, get) => ({
  // State
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalUsers: 0,
  
  // Filters
  filters: {
    search: '',
    status: 'all',
    role: 'all',
    signInMethod: 'all'
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 20
  },

  // Stats
  stats: {
    total: 0,
    active: 0,
    suspended: 0,
    banned: 0,
    emailVerified: 0,
    googleUsers: 0,
    emailUsers: 0,
    todayNew: 0,
    thisWeekNew: 0,
    thisMonthNew: 0
  },

  // Fetch all users with filters
  fetchUsers: async () => {
    const { filters, pagination } = get();
    set({ loading: true, error: null });

    try {
      let q = collection(db, 'users');
      const constraints = [];

      // Apply status filter
      if (filters.status !== 'all') {
        constraints.push(where('status', '==', filters.status));
      }

      // Apply role filter
      if (filters.role !== 'all') {
        constraints.push(where('role', '==', filters.role));
      }

      // Add sorting
      constraints.push(orderBy('createdAt', 'desc'));

      q = query(q, ...constraints);
      const snapshot = await getDocs(q);
      
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          lastLoginAt: data.lastLoginAt?.toDate?.() || data.lastLoginAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        };
      });

      // Determine sign-in method for each user
      let usersWithMethod = users.map(user => ({
        ...user,
        signInMethod: user.uid?.startsWith('google') ? 'google' : 'email'
      }));

      if (filters.signInMethod !== 'all') {
        usersWithMethod = usersWithMethod.filter(
          (user) => user.signInMethod === filters.signInMethod
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase().trim();
        usersWithMethod = usersWithMethod.filter((user) => {
          const displayName = user.displayName?.toLowerCase() || '';
          const email = user.email?.toLowerCase() || '';
          const phone = user.phone?.toLowerCase?.() || String(user.phone || '').toLowerCase();

          return (
            displayName.includes(searchTerm) ||
            email.includes(searchTerm) ||
            phone.includes(searchTerm)
          );
        });
      }

      const totalUsers = usersWithMethod.length;
      const totalPages = Math.max(1, Math.ceil(totalUsers / pagination.limit));

      set(state => ({
        users: usersWithMethod,
        pagination: {
          ...state.pagination,
          page: Math.min(state.pagination.page, totalPages)
        },
        totalUsers,
        loading: false
      }));

      // Update stats after fetching
      await get().fetchUserStats();

    } catch (error) {
      console.error('Error fetching users:', error);
      set({ 
        error: error.message || 'Failed to fetch users', 
        loading: false 
      });
      toast.error('Failed to fetch users');
    }
  },

  // Fetch single user by ID
  fetchUserById: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const user = {
          id: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          lastLoginAt: data.lastLoginAt?.toDate?.() || data.lastLoginAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          signInMethod: userDoc.id?.startsWith('google') ? 'google' : 'email'
        };
        
        set({ selectedUser: user, loading: false });
        return user;
      } else {
        set({ 
          error: 'User not found', 
          loading: false 
        });
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ 
        error: error.message || 'Failed to fetch user', 
        loading: false 
      });
      toast.error('Failed to fetch user');
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    set({ loading: true });
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Update local state
      set(state => ({
        users: state.users.map(u => 
          u.id === userId ? { ...u, ...updates, updatedAt: new Date() } : u
        ),
        selectedUser: state.selectedUser?.id === userId 
          ? { ...state.selectedUser, ...updates, updatedAt: new Date() }
          : state.selectedUser,
        loading: false
      }));

      toast.success('User updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      set({ 
        error: error.message || 'Failed to update user', 
        loading: false 
      });
      toast.error('Failed to update user');
      return { success: false, error: error.message };
    }
  },

  // Update user status (suspend/activate/ban)
  updateUserStatus: async (userId, status) => {
    set({ loading: true });
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status,
        updatedAt: new Date(),
        statusChangedAt: new Date()
      });

      // Update local state
      set(state => ({
        users: state.users.map(u => 
          u.id === userId ? { ...u, status, updatedAt: new Date() } : u
        ),
        selectedUser: state.selectedUser?.id === userId 
          ? { ...state.selectedUser, status, updatedAt: new Date() }
          : state.selectedUser,
        loading: false
      }));

      toast.success(`User ${status} successfully`);
      return { success: true };
    } catch (error) {
      console.error('Error updating user status:', error);
      set({ 
        error: error.message || 'Failed to update user status', 
        loading: false 
      });
      toast.error('Failed to update user status');
      return { success: false };
    }
  },

  // Delete user (soft delete)
  deleteUser: async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return { success: false };
    }

    set({ loading: true });
    
    try {
      // Soft delete - just mark as deleted
      await updateDoc(doc(db, 'users', userId), {
        status: 'deleted',
        deletedAt: new Date(),
        updatedAt: new Date()
      });

      // Update local state
      set(state => ({
        users: state.users.filter(u => u.id !== userId),
        selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser,
        loading: false
      }));

      toast.success('User deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      set({ 
        error: error.message || 'Failed to delete user', 
        loading: false 
      });
      toast.error('Failed to delete user');
      return { success: false };
    }
  },

  // Fetch user statistics
  fetchUserStats: async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      const stats = {
        total: 0,
        active: 0,
        suspended: 0,
        banned: 0,
        emailVerified: 0,
        googleUsers: 0,
        emailUsers: 0,
        todayNew: 0,
        thisWeekNew: 0,
        thisMonthNew: 0
      };

      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      snapshot.forEach(doc => {
        const user = doc.data();
        stats.total++;

        // Count by status
        if (user.status === 'active') stats.active++;
        else if (user.status === 'suspended') stats.suspended++;
        else if (user.status === 'banned') stats.banned++;

        // Count verified emails
        if (user.emailVerified) stats.emailVerified++;

        // Count by sign-in method
        if (doc.id?.startsWith('google')) stats.googleUsers++;
        else stats.emailUsers++;

        // Count new users
        const createdAt = user.createdAt?.toDate?.() || user.createdAt;
        if (createdAt) {
          if (createdAt.toDateString() === today.toDateString()) {
            stats.todayNew++;
          }
          if (createdAt >= weekAgo) {
            stats.thisWeekNew++;
          }
          if (createdAt >= monthAgo) {
            stats.thisMonthNew++;
          }
        }
      });

      set({ stats });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  },

  // Set filters
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
    
    // Reset pagination and fetch
    set(state => ({
      pagination: { 
        ...state.pagination, 
        page: 1
      }
    }));
    
    get().fetchUsers();
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        search: '',
        status: 'all',
        role: 'all',
        signInMethod: 'all'
      },
      pagination: {
        page: 1,
        limit: 20
      }
    });
    get().fetchUsers();
  },

  setCurrentPage: (page) => {
    const nextPage = Math.max(1, page);
    set(state => ({
      pagination: {
        ...state.pagination,
        page: nextPage
      }
    }));
  },

  // Clear selected user
  clearSelectedUser: () => set({ selectedUser: null }),

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    totalUsers: 0,
    filters: {
      search: '',
      status: 'all',
      role: 'all',
      signInMethod: 'all'
    },
    pagination: {
      page: 1,
      limit: 20
    },
    stats: {
      total: 0,
      active: 0,
      suspended: 0,
      banned: 0,
      emailVerified: 0,
      googleUsers: 0,
      emailUsers: 0,
      todayNew: 0,
      thisWeekNew: 0,
      thisMonthNew: 0
    }
  })
}));

export default useUserStore;
