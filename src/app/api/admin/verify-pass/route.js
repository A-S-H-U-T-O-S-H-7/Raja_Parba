import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase/config";

const ALLOWED_PERMISSIONS = new Set([
  "view_pass_scanner",
  "view_entry_pass_management",
  "view_show_bookings",
  "manage_bookings",
]);

const allowedStatuses = new Set(["confirmed", "success", "paid", "completed", "active", "approved"]);
const blockedStatuses = new Set(["cancelled", "failed", "rejected", "blocked"]);
const softAllowedStatuses = new Set(["pending", "requested"]);

const normalizeDate = (value) => {
  if (!value) return null;
  if (value?.toDate && typeof value.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeScanPayload = (scanText = "") => {
  const raw = String(scanText || "").trim();
  if (!raw) return "";

  // If pasted value is a QR API URL, extract and decode actual payload.
  try {
    const url = new URL(raw);
    const dataParam = url.searchParams.get("data") || url.searchParams.get("text");
    if (dataParam) {
      return decodeURIComponent(dataParam).trim();
    }
  } catch {
    // Not a URL.
  }

  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw;
  }
};

const extractPassType = (scanText = "") => {
  const typeMatch = String(scanText || "").match(/Type\s*:\s*([^|]+)/i);
  return typeMatch?.[1]?.trim()?.toUpperCase() || "UNKNOWN";
};

const extractCandidateBookingIds = (scanText = "") => {
  const payload = normalizeScanPayload(scanText);
  const candidates = new Set();

  const idMatch = payload.match(/ID\s*[:=]\s*([^|\n\r]+)/i);
  if (idMatch?.[1]) {
    candidates.add(idMatch[1].trim());
  }

  // JSON payload support: {"bookingId":"..."} or {"id":"..."}
  if (payload.startsWith("{") && payload.endsWith("}")) {
    try {
      const parsed = JSON.parse(payload);
      if (parsed?.bookingId) candidates.add(String(parsed.bookingId).trim());
      if (parsed?.id) candidates.add(String(parsed.id).trim());
      if (parsed?.order_id) candidates.add(String(parsed.order_id).trim());
    } catch {
      // ignore
    }
  }

  // Fallback: raw payload as direct ID
  if (!candidates.size && payload) {
    candidates.add(payload.trim());
  }

  return Array.from(candidates)
    .map((v) => v.replace(/^['"`]|['"`]$/g, "").trim())
    .filter(Boolean);
};

const findBookingByIdOrField = async (collectionName, candidateIds = []) => {
  for (const candidateId of candidateIds) {
    const byDocId = await getDoc(doc(db, collectionName, candidateId));
    if (byDocId.exists()) {
      return { id: byDocId.id, ...byDocId.data() };
    }

    const fieldQueries = [
      query(collection(db, collectionName), where("bookingId", "==", candidateId)),
      query(collection(db, collectionName), where("registrationId", "==", candidateId)),
      query(collection(db, collectionName), where("id", "==", candidateId)),
      query(collection(db, collectionName), where("order_id", "==", candidateId)),
      query(collection(db, collectionName), where("orderId", "==", candidateId)),
    ];

    for (const q of fieldQueries) {
      const snap = await getDocs(q);
      if (!snap.empty) {
        const first = snap.docs[0];
        return { id: first.id, ...first.data() };
      }
    }
  }

  return null;
};

const getDisplayName = (booking = {}) =>
  booking?.vendorDetails?.ownerName ||
  booking?.vendorDetails?.name ||
  booking?.donorDetails?.name ||
  booking?.delegateDetails?.name ||
  booking?.userDetails?.name ||
  booking?.customerDetails?.name ||
  booking?.name ||
  "Unknown";

const hasScannerAccess = (admin = {}) => {
  if (admin?.role === "super_admin") return true;
  const perms = Array.isArray(admin?.permissions) ? admin.permissions : [];
  return perms.some((perm) => ALLOWED_PERMISSIONS.has(perm));
};

const getBookingStatus = (booking = {}) => String(booking?.status || "pending").toLowerCase();

const isValidForEntry = (booking = {}) => {
  const status = getBookingStatus(booking);
  if (!status) return true;
  if (blockedStatuses.has(status)) return false;
  return allowedStatuses.has(status) || softAllowedStatuses.has(status);
};

const SEARCH_SOURCES = [
  { collection: "delegateBookings", typeLabel: "ENTRY/FREE PASS" },
  { collection: "showBookings", typeLabel: "SHOW RESERVATION" },
  { collection: "stallBookings", typeLabel: "STALL RESERVATION" },
  { collection: "performers", typeLabel: "PERFORMER PASS" },
  { collection: "award_applications", typeLabel: "AWARD PASS" },
  { collection: "raja_kumari_applications", typeLabel: "RAJA KUMARI PASS" },
  { collection: "raja_queen_applications", typeLabel: "RAJA QUEEN PASS" },
  { collection: "poda_pitha_applications", typeLabel: "PODA PITHA PASS" },
  { collection: "drawing_applications", typeLabel: "DRAWING PASS" },
  { collection: "sponsors", typeLabel: "SPONSOR PASS" },
  { collection: "bookings", typeLabel: "LEGACY PASS" },
];

const findBookingAcrossSources = async (candidateIds = [], qrType = "UNKNOWN") => {
  const normalizedType = String(qrType || "").toUpperCase();

  // Prioritize obvious collections by QR type, then fallback to all.
  const prioritized = [...SEARCH_SOURCES].sort((a, b) => {
    const score = (entry) => {
      const label = entry.typeLabel.toUpperCase();
      if (normalizedType.includes("SHOW") && label.includes("SHOW")) return 2;
      if (normalizedType.includes("STALL") && label.includes("STALL")) return 2;
      if (normalizedType.includes("FREE") && entry.collection === "delegateBookings") return 2;
      if (normalizedType.includes("ENTRY") && entry.collection === "delegateBookings") return 2;
      if (normalizedType.includes("PERFORM") && label.includes("PERFORMER")) return 2;
      if (normalizedType.includes("AWARD") && label.includes("AWARD")) return 2;
      if (normalizedType.includes("KUMARI") && label.includes("KUMARI")) return 2;
      if (normalizedType.includes("QUEEN") && label.includes("QUEEN")) return 2;
      if (normalizedType.includes("DRAW") && label.includes("DRAWING")) return 2;
      return 1;
    };
    return score(b) - score(a);
  });

  for (const source of prioritized) {
    const hit = await findBookingByIdOrField(source.collection, candidateIds);
    if (hit) {
      return {
        booking: hit,
        sourceCollection: source.collection,
        typeLabel: source.typeLabel,
      };
    }
  }

  return null;
};

const buildDetails = (booking, typeLabel) => ({
  bookingId: booking?.bookingId || booking?.id || "N/A",
  passType: typeLabel,
  name: getDisplayName(booking),
  bookingStatus: booking?.status || "pending",
  createdAt: normalizeDate(booking?.createdAt)?.toISOString() || null,
});

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const sessionDoc = await getDoc(doc(db, "admin_sessions", sessionToken));
    if (!sessionDoc.exists()) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const session = sessionDoc.data() || {};
    const expiresAt = normalizeDate(session.expiresAt);
    if (!expiresAt || expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    const adminDoc = await getDoc(doc(db, "admin_users", session.adminId));
    if (!adminDoc.exists()) {
      return NextResponse.json({ success: false, error: "Admin not found" }, { status: 403 });
    }

    const admin = { id: adminDoc.id, ...adminDoc.data() };
    if (!hasScannerAccess(admin)) {
      return NextResponse.json({ success: false, error: "No scanner permission" }, { status: 403 });
    }

    const body = await request.json();
    const scanText = normalizeScanPayload(String(body?.scanText || ""));
    if (!scanText) {
      return NextResponse.json({ success: false, error: "Missing QR data" }, { status: 400 });
    }

    const candidateIds = extractCandidateBookingIds(scanText);
    if (!candidateIds.length) {
      return NextResponse.json({ success: false, error: "Invalid QR format" }, { status: 400 });
    }
    const qrType = extractPassType(scanText);
    const lookup = await findBookingAcrossSources(candidateIds, qrType);
    const booking = lookup?.booking || null;
    const sourceCollection = lookup?.sourceCollection || "";
    let typeLabel = lookup?.typeLabel || "UNKNOWN";
    const bookingId = candidateIds[0];

    if (!booking) {
      await addDoc(collection(db, "admin_pass_scans"), {
        adminId: admin.id,
        adminName: admin.name || admin.username || "Admin",
        bookingId,
        qrType,
        status: "not_found",
        rawText: scanText.slice(0, 600),
        createdAt: serverTimestamp(),
      });
      return NextResponse.json({ success: false, error: "Pass not found" }, { status: 404 });
    }

    // Refine label when source stores mixed pass/application types.
    if (sourceCollection === "delegateBookings") {
      if (booking?.category === "free_pass" || booking?.eventDetails?.delegateType === "freePass") {
        typeLabel = "FREE ENTRY PASS";
      } else {
        typeLabel = "ENTRY PASS";
      }
    } else if (sourceCollection === "bookings") {
      if (booking?.showDetails) typeLabel = "SHOW RESERVATION";
      else if (booking?.category === "free_pass") typeLabel = "FREE ENTRY PASS";
    }

    const valid = isValidForEntry(booking);
    const details = buildDetails(booking, typeLabel);

    const duplicateScanQuery = query(
      collection(db, "admin_pass_scans"),
      where("bookingId", "==", details.bookingId),
      where("status", "in", ["valid", "used"])
    );
    const duplicateSnap = await getDocs(duplicateScanQuery);
    const wasScannedBefore = !duplicateSnap.empty;

    const scanStatus = valid ? (wasScannedBefore ? "used" : "valid") : "invalid";
    const scanMessage = valid
      ? wasScannedBefore
        ? "Pass already scanned earlier"
        : "Pass is valid"
      : "Pass status is not valid for entry";

    await addDoc(collection(db, "admin_pass_scans"), {
      adminId: admin.id,
      adminName: admin.name || admin.username || "Admin",
      bookingId: details.bookingId,
      bookingRefId: booking.id,
      sourceCollection,
      qrType,
      status: scanStatus,
      bookingStatus: details.bookingStatus,
      rawText: scanText.slice(0, 600),
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      status: scanStatus,
      message: scanMessage,
      details,
    });
  } catch (error) {
    console.error("verify-pass error:", error);
    return NextResponse.json(
      { success: false, error: "Internal verification error" },
      { status: 500 }
    );
  }
}
