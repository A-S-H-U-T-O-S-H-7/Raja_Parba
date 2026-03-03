import { collection, addDoc, Timestamp, doc, runTransaction } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

const RAJA_KUMARI_COLLECTION = 'raja_kumari_applications';

const getYearShort = (date = new Date()) => String(date.getFullYear()).slice(-2);

const generateRajaKumariRegistrationId = async () => {
  const yearShort = getYearShort();
  const counterRef = doc(db, 'application_counters', `kumari_${yearShort}`);

  const seq = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(counterRef);
    const current = snapshot.exists() ? Number(snapshot.data()?.seq || 0) : 0;
    const next = current + 1;
    transaction.set(
      counterRef,
      {
        seq: next,
        year: yearShort,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
    return next;
  });

  const padded = String(seq).padStart(3, '0');
  return `orp-kumari-${yearShort}-${padded}`;
};

export const createRajaKumariApplication = async (applicationData, photoFile) => {
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
    const fileName = `raja_kumari_${timestamp}.${extension}`;
    const storageRef = ref(storage, `raja-kumari/photos/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, photoFile);
    const photoUrl = await getDownloadURL(uploadResult.ref);
    const registrationId = await generateRajaKumariRegistrationId();

    const docRef = await addDoc(collection(db, RAJA_KUMARI_COLLECTION), {
      ...applicationData,
      registrationId,
      photoUrl,
      photoPath: uploadResult.ref.fullPath,
      competitions: ['Self-introduction', 'Rangoli', 'Quiz', 'Dress/Attire'],
      status: 'pending',
      reviewStatus: 'pending',
      adminNotes: '',
      confirmedAt: null,
      eventDate: null,
      eventTime: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: 'raja-kumari'
    });

    return { id: docRef.id, registrationId, success: true, photoUrl };
  } catch (error) {
    console.error('Error creating Raja Kumari application:', error);
    throw error;
  }
};
