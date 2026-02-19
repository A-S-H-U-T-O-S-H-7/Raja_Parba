import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'guests';
const DEFAULT_PLACEHOLDER = 'https://ui-avatars.com/api/?name=Guest&background=3B82F6&color=fff';

// Get guests for public display
export const getGuests = async (filters = {}) => {
  try {
    const constraints = [where('isActive', '==', true)];
    
    if (filters.category && filters.category !== 'all') {
      constraints.push(where('category', '==', filters.category));
    }
    
    constraints.push(orderBy('order', 'asc'));
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const guests = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown Guest',
        title: data.title || '',
        description: data.description || '',
        significance: data.significance || '',
        category: data.category || 'spiritual',
        imageUrl: data.imageUrl || DEFAULT_PLACEHOLDER,
        order: data.order || 0,
        isExpected: data.isExpected || false,
      };
    });
    
    return {
      success: true,
      data: guests
    };
  } catch (error) {
    console.error('Error fetching guests:', error);
    return {
      success: false,
      data: [],
      error: error.message
    };
  }
};