import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminAuthService } from "@/lib/admin/auth";

const EXCLUDED_STATUSES = new Set(["cancelled", "failed", "rejected", "blocked"]);

const MAIL_SOURCES = [
  {
    key: "entryPass",
    label: "Entry / Free Pass",
    collectionName: "delegateBookings",
    emailPaths: ["delegateDetails.email", "email", "userEmail"],
    namePaths: ["delegateDetails.name", "name", "userName"],
  },
  {
    key: "showSeats",
    label: "Show Seats",
    collectionName: "showBookings",
    emailPaths: ["userDetails.email", "customerDetails.email", "email", "userEmail"],
    namePaths: ["userDetails.name", "customerDetails.name", "name", "userName"],
  },
  {
    key: "stallSeats",
    label: "Stall Seats",
    collectionName: "stallBookings",
    emailPaths: ["vendorDetails.email", "email", "userEmail"],
    namePaths: ["vendorDetails.name", "vendorDetails.businessName", "name", "userName"],
  },
  {
    key: "award",
    label: "Award Contestants",
    collectionName: "award_applications",
    emailPaths: ["email", "applicant.email"],
    namePaths: ["name", "applicantName", "nomineeName"],
  },
  {
    key: "rajaKumari",
    label: "Raja Kumari Contestants",
    collectionName: "raja_kumari_applications",
    emailPaths: ["email", "participant.email"],
    namePaths: ["name", "participantName"],
  },
  {
    key: "rajaQueen",
    label: "Raja Queen Contestants",
    collectionName: "raja_queen_applications",
    emailPaths: ["email", "participant.email"],
    namePaths: ["name", "participantName"],
  },
  {
    key: "podaPitha",
    label: "Poda Pitha Contestants",
    collectionName: "poda_pitha_applications",
    emailPaths: ["email", "participant.email"],
    namePaths: ["name", "participantName"],
  },
  {
    key: "drawing",
    label: "Drawing Contestants",
    collectionName: "drawing_applications",
    emailPaths: ["email", "participant.email"],
    namePaths: ["name", "participantName"],
  },
  {
    key: "performers",
    label: "Performers",
    collectionName: "performers",
    emailPaths: ["email", "contact.email"],
    namePaths: ["name", "performerName", "groupName"],
  },
  {
    key: "sponsors",
    label: "Sponsors",
    collectionName: "sponsors",
    emailPaths: ["email", "contact.email"],
    namePaths: ["name", "sponsorName", "companyName"],
  },
];

const CANCELLATION_EMAIL_ENDPOINT = "https://svsamiti.com/rajaparba/cancel-email.php";

const getValue = (obj, path) =>
  path.split(".").reduce((current, key) => current?.[key], obj);

const firstValue = (data, paths) => {
  for (const path of paths) {
    const value = getValue(data, path);
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeStatus = (status) => String(status || "").trim().toLowerCase();

const isActiveRecord = (data) => !EXCLUDED_STATUSES.has(normalizeStatus(data?.status));

const requireAdmin = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return { error: "Admin session missing", status: 401 };
  }

  const result = await adminAuthService.verifySession(sessionToken);
  if (!result.success) {
    return { error: result.error || "Invalid admin session", status: 401 };
  }

  const admin = result.admin;
  const canSend =
    admin.role === "super_admin" ||
    admin.permissions?.includes("manage_settings") ||
    admin.permissions?.includes("view_users");

  if (!canSend) {
    return { error: "You do not have permission to send cancellation mails", status: 403 };
  }

  return { admin };
};

const collectRecipients = async () => {
  const recipientsByEmail = new Map();
  const sourceSummary = {};
  const missingEmail = [];
  let rawRecords = 0;
  let excludedRecords = 0;

  for (const source of MAIL_SOURCES) {
    const snapshot = await getDocs(collection(db, source.collectionName));
    sourceSummary[source.key] = {
      label: source.label,
      collectionName: source.collectionName,
      total: snapshot.size,
      active: 0,
      uniqueEmails: 0,
      missingEmail: 0,
      excluded: 0,
    };

    snapshot.forEach((docSnap) => {
      rawRecords += 1;
      const data = docSnap.data();

      if (!isActiveRecord(data)) {
        excludedRecords += 1;
        sourceSummary[source.key].excluded += 1;
        return;
      }

      sourceSummary[source.key].active += 1;
      const email = normalizeEmail(firstValue(data, source.emailPaths));
      const name = firstValue(data, source.namePaths) || "Community Member";

      if (!isValidEmail(email)) {
        sourceSummary[source.key].missingEmail += 1;
        missingEmail.push({
          source: source.label,
          collectionName: source.collectionName,
          documentId: docSnap.id,
          name,
        });
        return;
      }

      const sourceEntry = {
        sourceKey: source.key,
        source: source.label,
        collectionName: source.collectionName,
        documentId: docSnap.id,
        status: data?.status || null,
      };

      if (recipientsByEmail.has(email)) {
        recipientsByEmail.get(email).sources.push(sourceEntry);
      } else {
        recipientsByEmail.set(email, {
          email,
          name,
          sources: [sourceEntry],
        });
      }
    });
  }

  const recipients = Array.from(recipientsByEmail.values()).sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  for (const recipient of recipients) {
    const seenSourceKeys = new Set(recipient.sources.map((source) => source.sourceKey));
    seenSourceKeys.forEach((sourceKey) => {
      if (sourceSummary[sourceKey]) {
        sourceSummary[sourceKey].uniqueEmails += 1;
      }
    });
  }

  return {
    recipients,
    missingEmail,
    summary: {
      rawRecords,
      excludedRecords,
      uniqueRecipients: recipients.length,
      duplicateRecords: Math.max(0, rawRecords - excludedRecords - missingEmail.length - recipients.length),
      sources: sourceSummary,
    },
  };
};

const sendCancellationEmail = async ({ recipient }) => {
  const formData = new FormData();
  formData.append("name", recipient.name || "Community Member");
  formData.append("email", recipient.email);

  const response = await fetch(CANCELLATION_EMAIL_ENDPOINT, {
    method: "POST",
    body: formData,
    redirect: "follow",
  });

  const responseText = await response.text();
  let parsed = null;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid response from cancellation email service: ${responseText}`);
  }

  if (!response.ok || !parsed?.status) {
    throw new Error(parsed?.message || `Cancellation email service failed with ${response.status}`);
  }

  return {
    messageId: parsed?.messageId || null,
    message: parsed?.message || "Cancellation notice sent successfully.",
    rawResponse: parsed,
  };
};

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const data = await collectRecipients();
  return NextResponse.json({ success: true, ...data });
}

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => ({}));
  const start = Math.max(0, Number(body?.start || 0));
  const batchSize = Math.min(50, Math.max(1, Number(body?.batchSize || 20)));
  const testEmail = normalizeEmail(body?.testEmail);

  const { recipients, summary } = await collectRecipients();
  const selectedRecipients = testEmail
    ? [{ email: testEmail, name: "Test Recipient", sources: [{ source: "Test Email" }] }]
    : recipients.slice(start, start + batchSize);

  if (testEmail && !isValidEmail(testEmail)) {
    return NextResponse.json({ success: false, error: "A valid test email is required" }, { status: 400 });
  }

  const runRef = await addDoc(collection(db, "cancellation_mail_runs"), {
    mode: testEmail ? "test" : "batch",
    start,
    batchSize,
    requestedBy: {
      id: auth.admin.id || null,
      username: auth.admin.username || null,
      name: auth.admin.name || null,
      role: auth.admin.role || null,
    },
    totalRecipients: recipients.length,
    createdAt: serverTimestamp(),
  });

  const results = [];

  for (const recipient of selectedRecipients) {
    try {
      const info = await sendCancellationEmail({ recipient });
      results.push({
        email: recipient.email,
        name: recipient.name,
        success: true,
        messageId: info?.messageId || null,
        message: info?.message || null,
        sources: recipient.sources,
      });
    } catch (error) {
      results.push({
        email: recipient.email,
        name: recipient.name,
        success: false,
        error: error.message || "Failed to send email",
        sources: recipient.sources,
      });
    }
  }

  await addDoc(collection(db, "cancellation_mail_run_logs"), {
    runId: runRef.id,
    createdAt: serverTimestamp(),
    results,
  });

  const sent = results.filter((item) => item.success).length;
  const failed = results.length - sent;
  const nextStart = testEmail ? start : start + selectedRecipients.length;

  return NextResponse.json({
    success: failed === 0,
    runId: runRef.id,
    sent,
    failed,
    results,
    totalRecipients: summary.uniqueRecipients,
    nextStart,
    done: testEmail || nextStart >= summary.uniqueRecipients,
  });
}
