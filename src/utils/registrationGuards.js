import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

  const normalizedEmail = String(email || "").trim();
  const normalizedPhone = String(phone || "").trim();
  const normalizedUserId = String(userId || "").trim();

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

