import { create } from 'zustand';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value?.toDate) return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sortByCreatedAtDesc = (items) =>
  items.sort((a, b) => {
    const aTime = toDate(a.createdAt)?.getTime() || 0;
    const bTime = toDate(b.createdAt)?.getTime() || 0;
    return bTime - aTime;
  });

const fetchByUserAndEmail = async (collectionName, user) => {
  const ref = collection(db, collectionName);
  const jobs = [getDocs(query(ref, where('userId', '==', user.uid)))];

  if (user.email) {
    jobs.push(getDocs(query(ref, where('email', '==', user.email))));
  }

  const snapshots = await Promise.all(jobs);
  const map = new Map();
  snapshots.forEach((snapshot) => {
    snapshot.forEach((item) => map.set(item.id, { id: item.id, ...item.data() }));
  });
  return Array.from(map.values());
};

const useUserProfileStore = create((set, get) => ({
  loading: false,
  error: null,
  showBookings: [],
  stallBookings: [],
  entryPassBookings: [],
  donations: [],
  sponsors: [],
  performers: [],
  awards: [],
  rajaKumari: [],
  rajaQueen: [],
  podaPitha: [],
  drawings: [],

  fetchProfileData: async (user) => {
    if (!user?.uid) return;

    set({ loading: true, error: null });
    try {
      const [
        showRaw,
        stallRaw,
        entryPassRaw,
        donationsRaw,
        sponsorRaw,
        performerRaw,
        awardRaw,
        kumariRaw,
        queenRaw,
        podaPithaRaw,
        drawingRaw,
      ] = await Promise.all([
        fetchByUserAndEmail('showBookings', user),
        fetchByUserAndEmail('stallBookings', user),
        fetchByUserAndEmail('delegateBookings', user),
        fetchByUserAndEmail('donations', user),
        fetchByUserAndEmail('sponsors', user),
        fetchByUserAndEmail('performers', user),
        fetchByUserAndEmail('award_applications', user),
        fetchByUserAndEmail('raja_kumari_applications', user),
        fetchByUserAndEmail('raja_queen_applications', user),
        fetchByUserAndEmail('poda_pitha_applications', user),
        fetchByUserAndEmail('drawing_applications', user),
      ]);

      const showBookings = sortByCreatedAtDesc(
        showRaw.map((item) => ({
          ...item,
          type: 'show',
          createdAt: toDate(item.createdAt),
          showDetails: {
            ...(item.showDetails || {}),
            date: toDate(item.showDetails?.date),
          },
        }))
      );

      const stallBookings = sortByCreatedAtDesc(
        stallRaw.map((item) => ({
          ...item,
          type: 'stall',
          createdAt: toDate(item.createdAt),
        }))
      );

      const entryPassBookings = sortByCreatedAtDesc(
        entryPassRaw.map((item) => ({
          ...item,
          type: item.category === 'free_pass' ? 'free_pass' : 'entry_pass',
          createdAt: toDate(item.createdAt),
        }))
      );

      const donations = sortByCreatedAtDesc(
        donationsRaw.map((item) => ({
          ...item,
          type: 'donation',
          createdAt: toDate(item.createdAt),
        }))
      );

      const sponsors = sortByCreatedAtDesc(
        sponsorRaw.map((item) => ({
          ...item,
          type: 'sponsor',
          createdAt: toDate(item.createdAt),
        }))
      );

      const performers = sortByCreatedAtDesc(
        performerRaw.map((item) => ({
          ...item,
          type: 'performer',
          createdAt: toDate(item.createdAt),
        }))
      );

      const awards = sortByCreatedAtDesc(
        awardRaw.map((item) => ({
          ...item,
          type: 'award',
          createdAt: toDate(item.createdAt),
        }))
      );

      const rajaKumari = sortByCreatedAtDesc(
        kumariRaw.map((item) => ({
          ...item,
          type: 'raja-kumari',
          createdAt: toDate(item.createdAt),
        }))
      );

      const rajaQueen = sortByCreatedAtDesc(
        queenRaw.map((item) => ({
          ...item,
          type: 'raja-queen',
          createdAt: toDate(item.createdAt),
        }))
      );

      const podaPitha = sortByCreatedAtDesc(
        podaPithaRaw.map((item) => ({
          ...item,
          type: 'poda-pitha',
          createdAt: toDate(item.createdAt),
        }))
      );

      const drawings = sortByCreatedAtDesc(
        drawingRaw.map((item) => ({
          ...item,
          type: 'drawing',
          createdAt: toDate(item.createdAt),
        }))
      );

      set({
        loading: false,
        showBookings,
        stallBookings,
        entryPassBookings,
        donations,
        sponsors,
        performers,
        awards,
        rajaKumari,
        rajaQueen,
        podaPitha,
        drawings,
      });
    } catch (error) {
      set({ loading: false, error: error?.message || 'Failed to load profile data' });
    }
  },
}));

export default useUserProfileStore;
