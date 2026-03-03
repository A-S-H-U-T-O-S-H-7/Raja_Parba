import { db } from "@/lib/firebase";
import { doc, runTransaction, getDoc, setDoc } from "firebase/firestore";

/**
 * Generate sequential booking IDs:
 * - havan/delegate: sjpr-{type}-00001
 * - stall: orp-YY-stall-0001
 * - show: orp-YY-show-0001
 */

const BOOKING_TYPES = {
  HAVAN: "havan",
  STALL: "stall",
  SHOW: "show",
  DELEGATE: "delegate"
};

const getShowYearCode = () => new Date().getFullYear().toString().slice(-2);

const formatBookingId = (bookingType, count) => {
  if (bookingType === BOOKING_TYPES.STALL) {
    return `orp-${getShowYearCode()}-stall-${count.toString().padStart(4, "0")}`;
  }
  if (bookingType === BOOKING_TYPES.SHOW) {
    return `orp-${getShowYearCode()}-show-${count.toString().padStart(4, "0")}`;
  }
  return `sjpr-${bookingType}-${count.toString().padStart(5, "0")}`;
};

const initializeCounters = async () => {
  const counterRef = doc(db, "counters", "bookingIds");
  const counterSnap = await getDoc(counterRef);

  if (!counterSnap.exists()) {
    await setDoc(counterRef, {
      havan: { count: 0 },
      stall: { count: 0 },
      show: { count: 0 },
      delegate: { count: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

export const generateSequentialBookingId = async (bookingType) => {
  if (!Object.values(BOOKING_TYPES).includes(bookingType)) {
    throw new Error(`Invalid booking type: ${bookingType}`);
  }

  const maxRetries = 5;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const bookingId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "counters", "bookingIds");
        const counterDoc = await transaction.get(counterRef);

        if (!counterDoc.exists()) {
          const initialData = {
            havan: { count: 0 },
            stall: { count: 0 },
            show: { count: 0 },
            delegate: { count: 0 },
            createdAt: new Date(),
            updatedAt: new Date()
          };
          transaction.set(counterRef, initialData);
          return formatBookingId(bookingType, 1);
        }

        const data = counterDoc.data();
        const currentCount = data[bookingType]?.count || 0;
        const nextCount = currentCount + 1;

        transaction.update(counterRef, {
          [`${bookingType}.count`]: nextCount,
          [`${bookingType}.lastUpdated`]: new Date(),
          updatedAt: new Date()
        });

        return formatBookingId(bookingType, nextCount);
      });

      return bookingId;
    } catch (error) {
      retryCount += 1;

      if (retryCount >= maxRetries) {
        if (bookingType === BOOKING_TYPES.STALL) {
          return `orp-${getShowYearCode()}-stall-${String(Date.now()).slice(-4)}`;
        }
        if (bookingType === BOOKING_TYPES.SHOW) {
          return `orp-${getShowYearCode()}-show-${String(Date.now()).slice(-4)}`;
        }
        return `sjpr-${bookingType}-${Date.now()}`;
      }

      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 100));
    }
  }
};

export const getCurrentCounters = async () => {
  const counterRef = doc(db, "counters", "bookingIds");
  const counterSnap = await getDoc(counterRef);

  if (!counterSnap.exists()) {
    await initializeCounters();
    return {
      havan: { count: 0 },
      stall: { count: 0 },
      show: { count: 0 },
      delegate: { count: 0 }
    };
  }

  return counterSnap.data();
};

export const resetCounter = async (bookingType, newCount = 0) => {
  const counterRef = doc(db, "counters", "bookingIds");
  await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    if (!counterDoc.exists()) throw new Error("Counter document does not exist");

    transaction.update(counterRef, {
      [`${bookingType}.count`]: newCount,
      [`${bookingType}.resetAt`]: new Date(),
      updatedAt: new Date()
    });
  });
};

export const validateBookingIdFormat = (bookingId) => {
  const legacyPattern = /^sjpr-(havan|stall|show|delegate)-\d{5}$/;
  const stallPattern = /^orp-\d{2}-stall-\d{4}$/;
  const showPattern = /^orp-\d{2}-show-\d{4}$/;
  return legacyPattern.test(bookingId) || stallPattern.test(bookingId) || showPattern.test(bookingId);
};

export const extractBookingType = (bookingId) => {
  const legacyMatch = bookingId.match(/^sjpr-(havan|stall|show|delegate)-\d{5}$/);
  if (legacyMatch) return legacyMatch[1];

  if (/^orp-\d{2}-stall-\d{4}$/.test(bookingId)) return "stall";
  if (/^orp-\d{2}-show-\d{4}$/.test(bookingId)) return "show";
  return null;
};

export { BOOKING_TYPES };
