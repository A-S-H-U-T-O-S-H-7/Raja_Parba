// stores/admin/useRajaActivityStore.js
import { create } from 'zustand';
import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAdminAuthStore from './useAdminAuthStore';

const categoryCollectionMap = {
  sponsor: 'sponsors',
  performer: 'performers',
  award: 'award_applications',
  kumari: 'raja_kumari_applications',
  queen: 'raja_queen_applications',
  podaPitha: 'poda_pitha_applications',
  drawing: 'drawing_applications'
};

const useRajaActivityStore = create((set, get) => ({
  sponsors: [],
  performers: [],
  awardNominees: [],
  rajaKumari: [],
  rajaQueen: [],
  podaPitha: [],
  drawings: [],
  loading: false,
  error: null,
  selectedItem: null,
  activityLogs: [],

  fetchSponsors: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'sponsors'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const sponsors = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ sponsors, loading: false });
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to fetch sponsors');
      set({ loading: false });
    }
  },

  fetchPerformers: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'performers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const performers = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ performers, loading: false });
    } catch (error) {
      console.error('Error fetching performers:', error);
      toast.error('Failed to fetch performers');
      set({ loading: false });
    }
  },

  fetchAwardNominees: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'award_applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const awardNominees = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ awardNominees, loading: false });
    } catch (error) {
      console.error('Error fetching award nominees:', error);
      toast.error('Failed to fetch award nominees');
      set({ loading: false });
    }
  },

  fetchRajaKumari: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'raja_kumari_applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const rajaKumari = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ rajaKumari, loading: false });
    } catch (error) {
      console.error('Error fetching Raja Kumari applications:', error);
      toast.error('Failed to fetch Raja Kumari applications');
      set({ loading: false });
    }
  },

  fetchRajaQueen: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'raja_queen_applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const rajaQueen = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ rajaQueen, loading: false });
    } catch (error) {
      console.error('Error fetching Raja Queen applications:', error);
      toast.error('Failed to fetch Raja Queen applications');
      set({ loading: false });
    }
  },

  fetchPodaPitha: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'poda_pitha_applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const podaPitha = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ podaPitha, loading: false });
    } catch (error) {
      console.error('Error fetching Poda Pitha applications:', error);
      toast.error('Failed to fetch Poda Pitha applications');
      set({ loading: false });
    }
  },

  fetchDrawings: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'drawing_applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const drawings = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        createdAt: docItem.data().createdAt?.toDate?.()
      }));
      set({ drawings, loading: false });
    } catch (error) {
      console.error('Error fetching drawing applications:', error);
      toast.error('Failed to fetch drawing applications');
      set({ loading: false });
    }
  },

  addSponsor: async (data) => {
    const { admin } = useAdminAuthStore.getState();
    set({ loading: true });

    try {
      const docRef = await addDoc(collection(db, 'sponsors'), {
        ...data,
        status: 'requested',
        reviewStatus: 'requested',
        createdBy: admin?.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

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

  updateSponsor: async (id, data) => {
    const { admin } = useAdminAuthStore.getState();
    set({ loading: true });

    try {
      await updateDoc(doc(db, 'sponsors', id), {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: admin?.id
      });

      await get().logActivity({
        action: 'UPDATE',
        category: 'sponsor',
        itemId: id,
        details: `Updated sponsor: ${data.name || id}`
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

  updateItemStatus: async (category, id, status, notes = '', extraData = {}) => {
    const { admin } = useAdminAuthStore.getState();
    set({ loading: true });

    try {
      const collectionName = categoryCollectionMap[category];
      if (!collectionName) {
        toast.error('Unsupported category');
        set({ loading: false });
        return { success: false };
      }

      const itemRef = doc(db, collectionName, id);
      const existingSnap = await getDoc(itemRef);
      const existingData = existingSnap.exists() ? existingSnap.data() : null;

      await updateDoc(itemRef, {
        status,
        reviewStatus: status,
        adminNotes: notes,
        ...extraData,
        ...(status === 'confirmed' ? { confirmedAt: serverTimestamp() } : {}),
        updatedAt: serverTimestamp(),
        updatedBy: admin?.id
      });

      if (category === 'sponsor' && status === 'confirmed') {
        const sponsorName = existingData?.name || existingData?.organization || '';
        const sponsorEmail = existingData?.email || '';

        if (sponsorName && sponsorEmail) {
          try {
            const response = await fetch('/api/emails/sponsor-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: sponsorName,
                email: sponsorEmail
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Sponsor approval confirmation email failed:', emailResult);
              toast.error('Sponsor approved, but confirmation email failed.');
            } else {
              toast.success('Sponsor approval confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Sponsor approval email request failed:', emailError);
            toast.error('Sponsor approved, but confirmation email failed.');
          }
        }
      }

      if (category === 'award' && status === 'confirmed') {
        const nomineeName = existingData?.name || '';
        const nomineeEmail = existingData?.email || '';
        const awardName = existingData?.awardField || existingData?.award_name || 'Award Nomination';
        const eventDate = extraData?.awardDate || existingData?.awardDate || '';
        const eventTime = extraData?.awardTime || existingData?.awardTime || '';

        if (nomineeName && nomineeEmail && eventDate && eventTime) {
          try {
            const response = await fetch('/api/emails/award-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: nomineeName,
                email: nomineeEmail,
                award_name: awardName,
                event_date: eventDate,
                event_time: eventTime
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Award confirmation email failed:', emailResult);
              toast.error('Award confirmed, but confirmation email failed.');
            } else {
              toast.success('Award confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Award confirmation email request failed:', emailError);
            toast.error('Award confirmed, but confirmation email failed.');
          }
        }
      }

      if (category === 'performer' && status === 'confirmed') {
        const performerName = existingData?.name || '';
        const performerEmail = existingData?.email || '';
        const performanceDate = extraData?.performanceDate || existingData?.performanceDate || '';
        const performanceTime = extraData?.performanceTime || existingData?.performanceTime || '';

        if (performerName && performerEmail && performanceDate && performanceTime) {
          try {
            const response = await fetch('/api/emails/performer-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: performerName,
                email: performerEmail,
                performance_date: performanceDate,
                performance_time: performanceTime
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Performer confirmation email failed:', emailResult);
              toast.error('Performer confirmed, but confirmation email failed.');
            } else {
              toast.success('Performer confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Performer confirmation email request failed:', emailError);
            toast.error('Performer confirmed, but confirmation email failed.');
          }
        }
      }

      if (category === 'kumari' && status === 'confirmed') {
        const candidateName = existingData?.name || '';
        const candidateEmail = existingData?.email || '';
        const eventDate = extraData?.eventDate || existingData?.eventDate || '';
        const eventTime = extraData?.eventTime || existingData?.eventTime || '';

        if (candidateName && candidateEmail && eventDate && eventTime) {
          try {
            const response = await fetch('/api/emails/competition-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: candidateName,
                email: candidateEmail,
                competition_name: 'Raja Kumari',
                category: '6-15 yr age',
                event_date: eventDate,
                event_time: eventTime
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Raja Kumari confirmation email failed:', emailResult);
              toast.error('Raja Kumari confirmed, but confirmation email failed.');
            } else {
              toast.success('Raja Kumari confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Raja Kumari confirmation email request failed:', emailError);
            toast.error('Raja Kumari confirmed, but confirmation email failed.');
          }
        }
      }

      if (category === 'queen' && status === 'confirmed') {
        const candidateName = existingData?.name || '';
        const candidateEmail = existingData?.email || '';
        const eventDate = extraData?.eventDate || existingData?.eventDate || '';
        const eventTime = extraData?.eventTime || existingData?.eventTime || '';

        if (candidateName && candidateEmail && eventDate && eventTime) {
          try {
            const response = await fetch('/api/emails/competition-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: candidateName,
                email: candidateEmail,
                competition_name: 'Raja Queen',
                category: '16-30 yr age',
                event_date: eventDate,
                event_time: eventTime
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Raja Queen confirmation email failed:', emailResult);
              toast.error('Raja Queen confirmed, but confirmation email failed.');
            } else {
              toast.success('Raja Queen confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Raja Queen confirmation email request failed:', emailError);
            toast.error('Raja Queen confirmed, but confirmation email failed.');
          }
        }
      }

      if (category === 'podaPitha' && status === 'confirmed') {
        const candidateName = existingData?.name || '';
        const candidateEmail = existingData?.email || '';
        const eventDate = extraData?.eventDate || existingData?.eventDate || '';
        const eventTime = extraData?.eventTime || existingData?.eventTime || '';

        if (candidateName && candidateEmail && eventDate && eventTime) {
          try {
            const response = await fetch('/api/emails/competition-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: candidateName,
                email: candidateEmail,
                competition_name: 'Poda Pitha Competition',
                category: 'Open to all ages',
                event_date: eventDate,
                event_time: eventTime
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Poda Pitha confirmation email failed:', emailResult);
              toast.error('Poda Pitha confirmed, but confirmation email failed.');
            } else {
              toast.success('Poda Pitha confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Poda Pitha confirmation email request failed:', emailError);
            toast.error('Poda Pitha confirmed, but confirmation email failed.');
          }
        }
      }

      if (category === 'drawing' && status === 'confirmed') {
        const candidateName = existingData?.name || '';
        const candidateEmail = existingData?.email || '';
        const eventDate = extraData?.eventDate || existingData?.eventDate || '';
        const eventTime = extraData?.eventTime || existingData?.eventTime || '';
        const drawingCategory = (existingData?.category || '').toString().toLowerCase() === 'junior' ? 'Junior' : 'Senior';

        if (candidateName && candidateEmail && eventDate && eventTime) {
          try {
            const response = await fetch('/api/emails/competition-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: candidateName,
                email: candidateEmail,
                competition_name: 'Drawing Competition',
                category: drawingCategory,
                event_date: eventDate,
                event_time: eventTime
              })
            });
            const emailResult = await response.json();

            if (!response.ok || !emailResult?.status) {
              console.error('Drawing confirmation email failed:', emailResult);
              toast.error('Drawing confirmed, but confirmation email failed.');
            } else {
              toast.success('Drawing confirmation email sent.');
            }
          } catch (emailError) {
            console.error('Drawing confirmation email request failed:', emailError);
            toast.error('Drawing confirmed, but confirmation email failed.');
          }
        }
      }

      await get().logActivity({
        action: 'UPDATE',
        category,
        itemId: id,
        details: `Updated ${category} status to ${status}${notes ? ` (${notes})` : ''}`
      });

      switch (category) {
        case 'sponsor':
          await get().fetchSponsors();
          break;
        case 'performer':
          await get().fetchPerformers();
          break;
        case 'award':
          await get().fetchAwardNominees();
          break;
        case 'kumari':
          await get().fetchRajaKumari();
          break;
        case 'queen':
          await get().fetchRajaQueen();
          break;
        case 'podaPitha':
          await get().fetchPodaPitha();
          break;
        case 'drawing':
          await get().fetchDrawings();
          break;
        default:
          break;
      }

      toast.success(`Status updated to ${status}`);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('Error updating item status:', error);
      toast.error('Failed to update status');
      set({ loading: false });
      return { success: false };
    }
  },

  deleteItem: async (category, id) => {
    const { admin } = useAdminAuthStore.getState();

    if (admin?.role !== 'super_admin') {
      toast.error('Only Super Admin can delete items');
      return { success: false };
    }

    const confirmation = await Swal.fire({
      title: 'Delete this record?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!confirmation.isConfirmed) {
      return { success: false };
    }

    set({ loading: true });

    try {
      const collectionName = categoryCollectionMap[category];
      if (!collectionName) {
        toast.error('Unsupported category');
        set({ loading: false });
        return { success: false };
      }

      await deleteDoc(doc(db, collectionName, id));

      await get().logActivity({
        action: 'DELETE',
        category,
        itemId: id,
        details: `Deleted ${category} with ID: ${id}`
      });

      switch (category) {
        case 'sponsor':
          await get().fetchSponsors();
          break;
        case 'performer':
          await get().fetchPerformers();
          break;
        case 'award':
          await get().fetchAwardNominees();
          break;
        case 'kumari':
          await get().fetchRajaKumari();
          break;
        case 'queen':
          await get().fetchRajaQueen();
          break;
        case 'podaPitha':
          await get().fetchPodaPitha();
          break;
        case 'drawing':
          await get().fetchDrawings();
          break;
        default:
          break;
      }

      toast.success('Item deleted successfully');
      set({ loading: false });
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      set({ loading: false });
      return { success: false };
    }
  },

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

  fetchActivityLogs: async () => {
    try {
      const q = query(
        collection(db, 'raja_activity_logs'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
        timestamp: docItem.data().timestamp?.toDate?.()
      }));
      set({ activityLogs: logs });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  },

  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),

  reset: () =>
    set({
      sponsors: [],
      performers: [],
      awardNominees: [],
      rajaKumari: [],
      rajaQueen: [],
      podaPitha: [],
      drawings: [],
      loading: false,
      error: null,
      selectedItem: null
    })
}));

export default useRajaActivityStore;
