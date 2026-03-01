import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const AWARD_COLLECTION = 'award_applications';

export const createAwardApplication = async (applicationData, photoFile) => {
  try {
    if (!photoFile) {
      throw new Error('Candidate photo is required');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes((photoFile.type || '').toLowerCase())) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (photoFile.size > maxFileSize) {
      throw new Error('Photo size must be less than 5MB');
    }

    const timestamp = Date.now();
    const extension = (photoFile.name || 'jpg').split('.').pop().toLowerCase();
    const fileName = `award_${timestamp}.${extension}`;
    const storageRef = ref(storage, `awards/photos/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, photoFile);
    const photoUrl = await getDownloadURL(uploadResult.ref);

    const docRef = await addDoc(collection(db, AWARD_COLLECTION), {
      ...applicationData,
      photoUrl,
      photoPath: uploadResult.ref.fullPath,
      status: 'pending',
      reviewStatus: 'pending',
      adminNotes: '',
      confirmedAt: null,
      awardDate: null,
      awardTime: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: 'award'
    });

    return { id: docRef.id, success: true, photoUrl };
  } catch (error) {
    console.error('Error creating Award application:', error);
    throw error;
  }
};
