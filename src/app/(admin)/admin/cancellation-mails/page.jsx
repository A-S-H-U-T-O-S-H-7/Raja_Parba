"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  MailWarning,
  RefreshCw,
  Send,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import PermissionGate from "@/components/admin/PermissionGate";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

const batchSize = 20;

export default function CancellationMailsPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const isDark = isDarkMode;

  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0, logs: [] });
  const [error, setError] = useState("");

  const cardClass = isDark
    ? "bg-gray-800 border-gray-700 text-gray-100"
    : "bg-white border-gray-200 text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";
  const inputClass = isDark
    ? "bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400";

  const sourceRows = useMemo(() => {
    if (!preview?.summary?.sources) return [];
    return Object.values(preview.summary.sources);
  }, [preview]);

  const loadPreview = async () => {
    setLoadingPreview(true);
    setError("");
    try {
      const response = await fetch("/api/admin/cancellation-mails");
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load recipients");
      }
      setPreview(data);
      setProgress({ sent: 0, failed: 0, total: data.summary.uniqueRecipients, logs: [] });
    } catch (err) {
      setError(err.message || "Failed to load recipients");
    } finally {
      setLoadingPreview(false);
    }
  };

  const postBatch = async ({ start = 0, emailForTest = "" }) => {
    const response = await fetch("/api/admin/cancellation-mails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start,
        batchSize,
        testEmail: emailForTest || undefined,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to send cancellation emails");
    }
    return data;
  };

  const sendTest = async () => {
    setSending(true);
    setError("");
    try {
      const data = await postBatch({ emailForTest: testEmail.trim() });
      setProgress((current) => ({
        ...current,
        logs: [...data.results, ...current.logs].slice(0, 60),
      }));
    } catch (err) {
      setError(err.message || "Failed to send test email");
    } finally {
      setSending(false);
    }
  };

  const sendAll = async () => {
    if (!preview?.summary?.uniqueRecipients) {
      setError("Please preview recipients before sending.");
      return;
    }

    const confirmed = window.confirm(
      `Send cancellation email to ${preview.summary.uniqueRecipients} unique recipients?`
    );

    if (!confirmed) return;

    setSending(true);
    setError("");
    setProgress({ sent: 0, failed: 0, total: preview.summary.uniqueRecipients, logs: [] });

    try {
      let start = 0;
      let done = false;

      while (!done) {
        const data = await postBatch({ start });
        setProgress((current) => ({
          sent: current.sent + data.sent,
          failed: current.failed + data.failed,
          total: data.totalRecipients,
          logs: [...data.results, ...current.logs].slice(0, 100),
        }));
        start = data.nextStart;
        done = data.done;
      }
    } catch (err) {
      setError(err.message || "Failed while sending cancellation emails");
    } finally {
      setSending(false);
    }
  };

  const progressPercent = progress.total
    ? Math.round(((progress.sent + progress.failed) / progress.total) * 100)
    : 0;

  return (
    <PermissionGate permission="manage_settings">
      <div className="space-y-6">
        <div className={`rounded-xl border p-5 shadow-sm ${cardClass}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={`rounded-xl p-3 ${isDark ? "bg-red-950/50" : "bg-red-50"}`}>
                <MailWarning className={isDark ? "text-red-300" : "text-red-600"} size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Cancellation Mail Center</h1>
                <p className={`mt-2 max-w-3xl text-sm ${mutedText}`}>
                  Preview all active registrations, remove duplicate emails automatically, send a test,
                  then send the official cancellation notice in batches through the backend email API.
                </p>
                <p className={`mt-1 text-xs ${mutedText}`}>
                  Logged in as {admin?.name || admin?.username || "Admin"}
                </p>
              </div>
            </div>
            <button
              onClick={loadPreview}
              disabled={loadingPreview || sending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPreview ? <RefreshCw className="animate-spin" size={16} /> : <Eye size={16} />}
              Preview Recipients
            </button>
          </div>
        </div>

        {error && (
          <div className={`flex items-start gap-3 rounded-xl border p-4 ${isDark ? "border-red-800 bg-red-950/40 text-red-200" : "border-red-200 bg-red-50 text-red-800"}`}>
            <ShieldAlert size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className={`rounded-xl border p-5 shadow-sm ${cardClass}`}>
            <h2 className="text-lg font-semibold">Test Email</h2>
            <p className={`mt-1 text-sm ${mutedText}`}>
              The backend endpoint owns the subject, body, and HTML design. Send a test first to verify
              the final email before sending to all recipients.
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={testEmail}
                  onChange={(event) => setTestEmail(event.target.value)}
                  placeholder="Test email address"
                  className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${inputClass}`}
                />
                <button
                  onClick={sendTest}
                  disabled={sending || !testEmail.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  Send Test
                </button>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-5 shadow-sm ${cardClass}`}>
            <h2 className="text-lg font-semibold">Send Controls</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                <p className={`text-xs uppercase tracking-wide ${mutedText}`}>Unique Emails</p>
                <p className="mt-2 text-2xl font-bold">{preview?.summary?.uniqueRecipients ?? 0}</p>
              </div>
              <div className={`rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                <p className={`text-xs uppercase tracking-wide ${mutedText}`}>Missing Emails</p>
                <p className="mt-2 text-2xl font-bold">{preview?.missingEmail?.length ?? 0}</p>
              </div>
              <div className={`rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                <p className={`text-xs uppercase tracking-wide ${mutedText}`}>Duplicates Removed</p>
                <p className="mt-2 text-2xl font-bold">{preview?.summary?.duplicateRecords ?? 0}</p>
              </div>
              <div className={`rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                <p className={`text-xs uppercase tracking-wide ${mutedText}`}>Batch Size</p>
                <p className="mt-2 text-2xl font-bold">{batchSize}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className={mutedText}>Progress</span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <div className={`h-3 overflow-hidden rounded-full ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className={`mt-2 text-xs ${mutedText}`}>
                Sent {progress.sent}, failed {progress.failed}, total {progress.total}
              </p>
            </div>

            <button
              onClick={sendAll}
              disabled={sending || !preview?.summary?.uniqueRecipients}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? <RefreshCw className="animate-spin" size={16} /> : <AlertTriangle size={16} />}
              {sending ? "Sending..." : "Send Cancellation Mail to All"}
            </button>
          </div>
        </div>

        <div className={`rounded-xl border shadow-sm ${cardClass}`}>
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Recipient Preview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className={isDark ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-600"}>
                <tr>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Collection</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Unique Emails</th>
                  <th className="px-4 py-3">Missing</th>
                  <th className="px-4 py-3">Excluded</th>
                </tr>
              </thead>
              <tbody>
                {sourceRows.length ? (
                  sourceRows.map((source) => (
                    <tr key={source.collectionName} className={isDark ? "border-t border-gray-700" : "border-t border-gray-100"}>
                      <td className="px-4 py-3 font-medium">{source.label}</td>
                      <td className={`px-4 py-3 ${mutedText}`}>{source.collectionName}</td>
                      <td className="px-4 py-3">{source.total}</td>
                      <td className="px-4 py-3">{source.active}</td>
                      <td className="px-4 py-3">{source.uniqueEmails}</td>
                      <td className="px-4 py-3">{source.missingEmail}</td>
                      <td className="px-4 py-3">{source.excluded}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={`px-4 py-8 text-center ${mutedText}`} colSpan={7}>
                      Click Preview Recipients to load the current recipient list.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!!progress.logs.length && (
          <div className={`rounded-xl border p-5 shadow-sm ${cardClass}`}>
            <h2 className="text-lg font-semibold">Latest Send Results</h2>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
              {progress.logs.map((item, index) => (
                <div
                  key={`${item.email}-${index}`}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}
                >
                  {item.success ? (
                    <CheckCircle2 className="mt-0.5 text-green-500" size={18} />
                  ) : (
                    <XCircle className="mt-0.5 text-red-500" size={18} />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.email}</p>
                    <p className={`text-xs ${mutedText}`}>
                      {item.success ? "Sent successfully" : item.error || "Failed"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
