import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export class DuplicateRegistrationError extends Error {
  constructor(message = "A registration already exists for this email, phone, or account.") {
    super(message);
    this.name = "DuplicateRegistrationError";
  }
}

export const normalizeRegistrationEmail = (email) =>
  String(email || "").trim().toLowerCase();

export const normalizeRegistrationPhone = (phone) =>
  String(phone || "").replace(/\D/g, "");

export const normalizeRegistrationUserId = (userId) =>
  String(userId || "").trim();

const encodeKeyPart = (value) => encodeURIComponent(String(value || "")).replace(/%/g, "_");

const buildUniqueKeyRefs = ({ collectionName, userId, email, phone }) => {
  const refs = [];

  const normalizedUserId = normalizeRegistrationUserId(userId);
  const normalizedEmail = normalizeRegistrationEmail(email);
  const normalizedPhone = normalizeRegistrationPhone(phone);

  if (normalizedUserId) {
    refs.push({
      type: "userId",
      value: normalizedUserId,
      ref: doc(db, "single_registration_keys", `${collectionName}__userId__${encodeKeyPart(normalizedUserId)}`),
    });
  }

  if (normalizedEmail) {
    refs.push({
      type: "email",
      value: normalizedEmail,
      ref: doc(db, "single_registration_keys", `${collectionName}__email__${encodeKeyPart(normalizedEmail)}`),
    });
  }

  if (normalizedPhone) {
    refs.push({
      type: "phone",
      value: normalizedPhone,
      ref: doc(db, "single_registration_keys", `${collectionName}__phone__${encodeKeyPart(normalizedPhone)}`),
    });
  }

  return refs;
};

const hasAnyDoc = async (constraints) => {
  const snapshot = await getDocs(query(collection(db, constraints.collectionName), ...constraints.filters, limit(1)));
  return !snapshot.empty;
};

export const hasExistingSingleRegistration = async ({
  collectionName,
  userId,
  email,
  phone,
}) => {
  if (!collectionName) return false;

  const normalizedEmail = normalizeRegistrationEmail(email);
  const normalizedPhone = normalizeRegistrationPhone(phone);
  const normalizedUserId = normalizeRegistrationUserId(userId);

  if (normalizedUserId) {
    const existsByUserId = await hasAnyDoc({
      collectionName,
      filters: [where("userId", "==", normalizedUserId)],
    });
    if (existsByUserId) return true;
  }

  if (normalizedEmail) {
    const existsByEmail = await hasAnyDoc({
      collectionName,
      filters: [where("email", "==", normalizedEmail)],
    });
    if (existsByEmail) return true;
  }

  if (normalizedPhone) {
    const existsByPhone = await hasAnyDoc({
      collectionName,
      filters: [where("phone", "==", normalizedPhone)],
    });
    if (existsByPhone) return true;
  }

  return false;
};

export const createSingleRegistrationWithGuard = async ({
  collectionName,
  userId,
  email,
  phone,
  data,
  customDocRef,
}) => {
  if (!collectionName) {
    throw new Error("collectionName is required");
  }

  const existingRegistration = await hasExistingSingleRegistration({
    collectionName,
    userId,
    email,
    phone,
  });

  if (existingRegistration) {
    throw new DuplicateRegistrationError();
  }

  const applicationRef = customDocRef || doc(collection(db, collectionName));
  const keyRefs = buildUniqueKeyRefs({ collectionName, userId, email, phone });
  const createdAt = Timestamp.now();

  await runTransaction(db, async (transaction) => {
    for (const keyEntry of keyRefs) {
      const keySnapshot = await transaction.get(keyEntry.ref);
      if (keySnapshot.exists()) {
        throw new DuplicateRegistrationError();
      }
    }

    transaction.set(applicationRef, data);

    for (const keyEntry of keyRefs) {
      transaction.set(keyEntry.ref, {
        applicationId: applicationRef.id,
        collectionName,
        type: keyEntry.type,
        value: keyEntry.value,
        createdAt,
        updatedAt: createdAt,
      });
    }
  });

  return { id: applicationRef.id };
};

export const deleteSingleRegistrationKeys = async ({
  collectionName,
  userId,
  email,
  phone,
}) => {
  if (!collectionName) return;

  const keyRefs = buildUniqueKeyRefs({ collectionName, userId, email, phone });
  await Promise.all(keyRefs.map((keyEntry) => deleteDoc(keyEntry.ref)));
};
