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
  return allowedStatuses.has(status);
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
    const bookingId = candidateIds[0];

    const qrType = extractPassType(scanText);
    let booking = null;
    let typeLabel = "UNKNOWN";
    let sourceCollection = "";

    if (qrType === "FREE PASS") {
      booking = await findBookingByIdOrField("delegateBookings", candidateIds);
      typeLabel = "FREE PASS";
      sourceCollection = "delegateBookings";
    } else if (qrType === "SHOW RESERVATION") {
      booking = await findBookingByIdOrField("showBookings", candidateIds);
      typeLabel = "SHOW RESERVATION";
      sourceCollection = "showBookings";
    } else {
      const freePassBooking = await findBookingByIdOrField("delegateBookings", candidateIds);
      if (freePassBooking) {
        booking = freePassBooking;
        typeLabel = "FREE PASS";
        sourceCollection = "delegateBookings";
      } else {
        const showBooking = await findBookingByIdOrField("showBookings", candidateIds);
        if (showBooking) {
          booking = showBooking;
          typeLabel = "SHOW RESERVATION";
          sourceCollection = "showBookings";
        } else {
          // Legacy fallback collection in older flow versions.
          const legacyBooking = await findBookingByIdOrField("bookings", candidateIds);
          if (legacyBooking) {
            booking = legacyBooking;
            sourceCollection = "bookings";
            if (legacyBooking?.showDetails) typeLabel = "SHOW RESERVATION";
            else if (legacyBooking?.category === "free_pass") typeLabel = "FREE PASS";
          }
        }
      }
    }

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
