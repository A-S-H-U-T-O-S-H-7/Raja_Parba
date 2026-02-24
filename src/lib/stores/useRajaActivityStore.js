// stores/admin/useRajaActivityStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import useAdminAuthStore from './useAdminAuthStore';

const useRajaActivityStore = create((set, get) => ({
  // State for each category
  sponsors: [],
  performers: [],
  awardNominees: [],
  rajaKumari: [],
  fancyDress: [],
  
  loading: false,
  error: null,
  selectedItem: null,
  activityLogs: [],

  // Fetch sponsors
  fetchSponsors: async () => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'sponsors'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const sponsors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      }));
      set({ sponsors, loading: false });
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to fetch sponsors');
      set({ loading: false });
    }
  },

  // Fetch performers
  fetchPerformers: async () => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'performers'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const performers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      }));
      set({ performers, loading: false });
    } catch (error) {
      console.error('Error fetching performers:', error);
      toast.error('Failed to fetch performers');
      set({ loading: false });
    }
  },

  // Add sponsor
  addSponsor: async (data) => {
    const { admin } = useAdminAuthStore.getState();
    set({ loading: true });
    
    try {
      const docRef = await addDoc(collection(db, 'sponsors'), {
        ...data,
        status: 'pending',
        createdBy: admin?.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Log activity
      await get().logActivity({
        action: 'CREATE',
        category: 'sponsor',
        itemId: docRef.id,
        details: `Added sponsor: ${data.name}`
      });

      await get().fetchSponsors();
      toast.success('Sponsor added successfully');
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding sponsor:', error);
      toast.error('Failed to add sponsor');
      set({ loading: false });
      return { success: false };
    }
  },

  // Update sponsor
  updateSponsor: async (id, data) => {
    const { admin } = useAdminAuthStore.getState();
    set({ loading: true });
    
    try {
      await updateDoc(doc(db, 'sponsors', id), {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: admin?.id
      });

      // Log activity
      await get().logActivity({
        action: 'UPDATE',
        category: 'sponsor',
        itemId: id,
        details: `Updated sponsor: ${data.name}`
      });

      await get().fetchSponsors();
      toast.success('Sponsor updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error('Failed to update sponsor');
      set({ loading: false });
      return { success: false };
    }
  },

  // Delete item (only super admin can delete)
  deleteItem: async (category, id) => {
    const { admin } = useAdminAuthStore.getState();
    
    // Check if super admin
    if (admin?.role !== 'super_admin') {
      toast.error('Only Super Admin can delete items');
      return { success: false };
    }

    if (!confirm('Are you sure you want to delete this item?')) {
      return { success: false };
    }

    set({ loading: true });
    
    try {
      const collectionMap = {
        sponsor: 'sponsors',
        performer: 'performers',
        award: 'award_nominees',
        kumari: 'raja_kumari',
        fancy: 'fancy_dress'
      };

      const collectionName = collectionMap[category];
      await deleteDoc(doc(db, collectionName, id));

      // Log activity
      await get().logActivity({
        action: 'DELETE',
        category,
        itemId: id,
        details: `Deleted ${category} with ID: ${id}`
      });

      // Refresh the appropriate list
      switch(category) {
        case 'sponsor':
          await get().fetchSponsors();
          break;
        case 'performer':
          await get().fetchPerformers();
          break;
        // Add others as needed
      }

      toast.success('Item deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      set({ loading: false });
      return { success: false };
    }
  },

  // Log activity
  logActivity: async (data) => {
    const { admin } = useAdminAuthStore.getState();
    
    try {
      await addDoc(collection(db, 'raja_activity_logs'), {
        ...data,
        adminId: admin?.id,
        adminName: admin?.name,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  },

  // Fetch activity logs
  fetchActivityLogs: async () => {
    try {
      const q = query(
        collection(db, 'raja_activity_logs'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()
      }));
      set({ activityLogs: logs });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  },

  // Set selected item for editing
  setSelectedItem: (item) => set({ selectedItem: item }),

  // Clear selected item
  clearSelectedItem: () => set({ selectedItem: null }),

  // Reset
  reset: () => set({
    sponsors: [],
    performers: [],
    awardNominees: [],
    rajaKumari: [],
    fancyDress: [],
    loading: false,
    error: null,
    selectedItem: null
  })
}));

export default useRajaActivityStore;