// stores/admin/useAdminManagementStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useAdminAuthStore from './useAdminAuthStore';

// Available permissions based on your sidebar navigation
export const AVAILABLE_PERMISSIONS = [
  { id: 'view_overview', name: 'Dashboard', category: 'Dashboard' },
  { id: 'view_stall_bookings', name: 'Stall Booking', category: 'Bookings' },
  { id: 'manage_stalls', name: 'Stall Seats', category: 'Seats' },
  { id: 'view_show_bookings', name: 'Show Booking', category: 'Bookings' },
  { id: 'manage_show_seats', name: 'Show Seats', category: 'Seats' },
  { id: 'view_entry_pass_management', name: 'Entry Pass Management', category: 'Bookings' },
  { id: 'view_sponsor_performer', name: 'Sponsors and Performer', category: 'Management' },
  { id: 'manage_cancellations', name: 'Cancellation & Refund', category: 'Management' },
  { id: 'view_guests', name: 'Our Guests', category: 'Management' },
  { id: 'manage_gallery', name: 'Manage Gallery', category: 'Content' },
  { id: 'view_donations', name: 'Donation', category: 'Management' },
  { id: 'view_users', name: 'User Management', category: 'Management' },
  { id: 'manage_admins', name: 'Admin Management', category: 'Management' },
  { id: 'manage_pricing', name: 'Price Setting', category: 'Settings' },
  { id: 'manage_settings', name: 'System Settings', category: 'Settings' },
  { id: 'view_logs', name: 'Activity Log', category: 'Management' },
  { id: 'view_sponsor_performer', name: 'Raja Activity', category: 'Management' },

];

// Group permissions by category
export const PERMISSION_CATEGORIES = {
  'Dashboard': ['view_overview'],
  'Bookings': ['view_stall_bookings', 'view_show_bookings', 'view_entry_pass_management'],
  'Seats': ['manage_stalls', 'manage_show_seats'],
  'Management': ['view_sponsor_performer', 'manage_cancellations', 'view_guests', 'view_donations', 'view_users', 'manage_admins', 'view_logs'],
  'Content': ['manage_gallery'],
  'Settings': ['manage_pricing', 'manage_settings']
};

// Roles
export const ROLES = [
  { id: 'super_admin', name: 'Super Admin', description: 'Full access to all features' },
  { id: 'admin', name: 'Admin', description: 'Limited access based on permissions' }
];

const useAdminManagementStore = create((set, get) => ({
  // State
  admins: [],
  selectedAdmin: null,
  loading: false,
  error: null,
  
  // Fetch all admins
  fetchAdmins: async () => {
    set({ loading: true, error: null });
    
    try {
      const adminsRef = collection(db, 'admin_users');
      const snapshot = await getDocs(adminsRef);
      
      const adminsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          lastLogin: data.lastLogin?.toDate?.() || data.lastLogin,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        };
      });
      
      set({ admins: adminsData, loading: false });
    } catch (error) {
      console.error('Error fetching admins:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch admins');
    }
  },
  
  // Add new admin
  addAdmin: async (adminData) => {
    set({ loading: true, error: null });
    const { admin } = useAdminAuthStore.getState();
    
    try {
      // Check if username already exists
      const usernameQuery = query(
        collection(db, 'admin_users'), 
        where('username', '==', adminData.username.toLowerCase())
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      
      if (!usernameSnapshot.empty) {
        set({ loading: false });
        toast.error('Username already taken');
        return { success: false, error: 'Username already taken' };
      }
      
      // Check if email already exists
      if (adminData.email) {
        const emailQuery = query(
          collection(db, 'admin_users'), 
          where('email', '==', adminData.email.toLowerCase())
        );
        const emailSnapshot = await getDocs(emailQuery);
        
        if (!emailSnapshot.empty) {
          set({ loading: false });
          toast.error('Email already registered');
          return { success: false, error: 'Email already registered' };
        }
      }
      
      // Create admin document
      const adminRef = await addDoc(collection(db, 'admin_users'), {
        username: adminData.username.toLowerCase(),
        email: adminData.email?.toLowerCase(),
        password: adminData.password, // Plain text for now (you'll hash later)
        name: adminData.name,
        role: adminData.role,
        permissions: adminData.role === 'super_admin' ? [] : (adminData.permissions || []),
        status: 'active',
        createdBy: admin?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      });
      
      // Refresh the list
      await get().fetchAdmins();
      
      toast.success('Admin added successfully');
      return { success: true, id: adminRef.id };
    } catch (error) {
      console.error('Error adding admin:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to add admin');
      return { success: false, error: error.message };
    }
  },
  
  // Update admin
  updateAdmin: async (adminId, updates) => {
    set({ loading: true, error: null });
    const { admin } = useAdminAuthStore.getState();
    
    try {
      const adminRef = doc(db, 'admin_users', adminId);
      
      // Don't allow username change
      delete updates.username;
      delete updates.id;
      
      await updateDoc(adminRef, {
        ...updates,
        permissions: updates.role === 'super_admin' ? [] : (updates.permissions || []),
        updatedAt: new Date(),
        updatedBy: admin?.id
      });
      
      // Update local state
      set(state => ({
        admins: state.admins.map(a => 
          a.id === adminId ? { ...a, ...updates, updatedAt: new Date() } : a
        ),
        selectedAdmin: state.selectedAdmin?.id === adminId 
          ? { ...state.selectedAdmin, ...updates, updatedAt: new Date() }
          : state.selectedAdmin,
        loading: false
      }));
      
      toast.success('Admin updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating admin:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to update admin');
      return { success: false, error: error.message };
    }
  },
  
  // Delete admin
  deleteAdmin: async (adminId) => {
    set({ loading: true, error: null });
    const { admin } = useAdminAuthStore.getState();
    
    // Prevent self-deletion
    if (adminId === admin?.id) {
      set({ loading: false });
      toast.error('You cannot delete yourself');
      return { success: false, error: 'Cannot delete yourself' };
    }
    
    try {
      // Check if trying to delete the only super admin
      const adminToDelete = get().admins.find(a => a.id === adminId);
      
      if (adminToDelete?.role === 'super_admin') {
        const superAdmins = get().admins.filter(a => a.role === 'super_admin');
        if (superAdmins.length <= 1) {
          set({ loading: false });
          toast.error('Cannot delete the only super admin');
          return { success: false, error: 'Cannot delete the only super admin' };
        }
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'admin_users', adminId));
      
      // Update local state
      set(state => ({
        admins: state.admins.filter(a => a.id !== adminId),
        selectedAdmin: state.selectedAdmin?.id === adminId ? null : state.selectedAdmin,
        loading: false
      }));
      
      toast.success('Admin deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting admin:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to delete admin');
      return { success: false, error: error.message };
    }
  },
  
  // Get admin by ID
  getAdminById: (adminId) => {
    return get().admins.find(a => a.id === adminId);
  },
  
  // Select admin for editing
  selectAdmin: (admin) => {
    set({ selectedAdmin: admin });
  },
  
  // Clear selected admin
  clearSelectedAdmin: () => {
    set({ selectedAdmin: null });
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Reset store
  reset: () => set({
    admins: [],
    selectedAdmin: null,
    loading: false,
    error: null
  })
}));

export default useAdminManagementStore;
