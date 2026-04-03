import { Timestamp, doc, runTransaction } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import {
  createSingleRegistrationWithGuard,
  normalizeRegistrationEmail,
  normalizeRegistrationPhone,
  normalizeRegistrationUserId,
} from '@/utils/registrationGuards';

const PODA_PITHA_COLLECTION = 'poda_pitha_applications';

const getYearShort = (date = new Date()) => String(date.getFullYear()).slice(-2);

const generatePodaPithaRegistrationId = async () => {
  const yearShort = getYearShort();
  const counterRef = doc(db, 'application_counters', `poda_pitha_${yearShort}`);

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
  return `orp-pitha-${yearShort}-${padded}`;
};

export const createPodaPithaApplication = async (applicationData, photoFile) => {
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
    const fileName = `poda_pitha_${timestamp}.${extension}`;
    const storageRef = ref(storage, `poda-pitha/photos/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, photoFile);
    const photoUrl = await getDownloadURL(uploadResult.ref);
    const registrationId = await generatePodaPithaRegistrationId();

    const normalizedApplicationData = {
      ...applicationData,
      email: normalizeRegistrationEmail(applicationData?.email),
      phone: normalizeRegistrationPhone(applicationData?.phone),
      userId: normalizeRegistrationUserId(applicationData?.userId),
    };

    const result = await createSingleRegistrationWithGuard({
      collectionName: PODA_PITHA_COLLECTION,
      userId: normalizedApplicationData.userId,
      email: normalizedApplicationData.email,
      phone: normalizedApplicationData.phone,
      data: {
        ...normalizedApplicationData,
        registrationId,
        photoUrl,
        photoPath: uploadResult.ref.fullPath,
        rounds: ['Single physical round'],
        format: 'physical',
        status: 'pending',
        reviewStatus: 'pending',
        adminNotes: '',
        confirmedAt: null,
        eventDate: null,
        eventTime: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        type: 'poda-pitha'
      }
    });

    return { id: result.id, registrationId, success: true, photoUrl };
  } catch (error) {
    console.error('Error creating Poda Pitha application:', error);
    throw error;
  }
};
