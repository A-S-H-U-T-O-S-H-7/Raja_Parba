"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Loader2,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Ticket,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import PermissionGate from "@/components/admin/PermissionGate";

const statusColor = {
  valid: "text-emerald-700 bg-emerald-100 border-emerald-200",
  invalid: "text-red-700 bg-red-100 border-red-200",
  used: "text-amber-700 bg-amber-100 border-amber-200",
  blocked: "text-gray-700 bg-gray-100 border-gray-200",
};

const sanitizeScanText = (value = "") => value.trim().slice(0, 600);

export default function PassScanner() {
  const { isDarkMode } = useThemeStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanLockRef = useRef(false);
  const timerRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [lastRawScan, setLastRawScan] = useState("");
  const [result, setResult] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);

  const supportsBarcodeDetector =
    typeof window !== "undefined" && "BarcodeDetector" in window;

  const scannerBadge = useMemo(() => {
    if (verifying) return { text: "Verifying...", className: "text-indigo-700 bg-indigo-100 border-indigo-200" };
    if (cameraReady) return { text: "Camera Active", className: "text-emerald-700 bg-emerald-100 border-emerald-200" };
    return { text: "Scanner Idle", className: "text-gray-700 bg-gray-100 border-gray-200" };
  }, [cameraReady, verifying]);

  const stopCamera = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  const verifyScanText = async (rawText) => {
    const payload = sanitizeScanText(rawText);
    if (!payload) return;

    setVerifying(true);
    setLastRawScan(payload);
    setResult(null);

    try {
      const response = await fetch("/api/admin/verify-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanText: payload }),
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        setResult({
          status: "invalid",
          message: data?.error || "Pass verification failed",
          details: null,
        });
        toast.error(data?.error || "Invalid pass");
        return;
      }

      setResult({
        status: data.status || "valid",
        message: data.message || "Pass verified",
        details: data.details || null,
      });

      if (data.status === "valid") toast.success("Pass verified");
      else if (data.status === "used") toast("Already scanned before", { icon: "⚠️" });
      else toast.error(data.message || "Pass invalid");
    } catch (error) {
      console.error("Pass verify error:", error);
      setResult({
        status: "invalid",
        message: "Unable to verify pass right now",
        details: null,
      });
      toast.error("Verification failed");
    } finally {
      setVerifying(false);
      scanLockRef.current = false;
    }
  };

  const scanFrame = async () => {
    if (!detectorRef.current || !videoRef.current || !canvasRef.current) return;
    if (verifying || scanLockRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const barcodes = await detectorRef.current.detect(canvas);
      if (!barcodes?.length) return;

      const raw = barcodes[0]?.rawValue;
      if (!raw) return;

      scanLockRef.current = true;
      stopCamera();
      await verifyScanText(raw);
    } catch (error) {
      console.error("Scan frame error:", error);
    }
  };

  const startCamera = async () => {
    setCameraError("");
    setStartingCamera(true);
    try {
      if (!supportsBarcodeDetector) {
        setCameraError("Camera QR scanning is not supported in this browser. Use manual input below.");
        setStartingCamera(false);
        return;
      }

      detectorRef.current = new window.BarcodeDetector({ formats: ["qr_code"] });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
      timerRef.current = setInterval(scanFrame, 500);
    } catch (error) {
      console.error("Camera init error:", error);
      setCameraError("Could not start camera. Check camera permission and try again.");
      stopCamera();
    } finally {
      setStartingCamera(false);
    }
  };

  const handleManualVerify = async (event) => {
    event.preventDefault();
    if (!manualInput.trim()) {
      toast.error("Paste QR text first");
      return;
    }
    await verifyScanText(manualInput);
  };

  const resetState = () => {
    setResult(null);
    setLastRawScan("");
    setManualInput("");
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <PermissionGate permission="view_pass_scanner" showFallback>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Pass Scanner
            </h1>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Scan free pass and show booking QR at field entry point.
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${scannerBadge.className}`}>
            <ShieldCheck className="h-3.5 w-3.5" />
            {scannerBadge.text}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className={`rounded-2xl border p-4 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetState}
                disabled={verifying}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                  isDarkMode ? "border-gray-600 text-gray-200 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                Clear
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-dashed border-indigo-300 bg-black">
              <video ref={videoRef} className="h-[300px] w-full object-cover" muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center text-white">
                    <QrCode className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-sm">Tap Scan to read QR code</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={cameraReady ? stopCamera : startCamera}
                disabled={startingCamera || verifying}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                  cameraReady
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {startingCamera ? <Loader2 className="h-4 w-4 animate-spin" /> : cameraReady ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                {cameraReady ? "Stop Scan" : "Scan"}
              </button>
            </div>

            {cameraError && (
              <p className={`mt-3 rounded-lg border px-3 py-2 text-sm ${isDarkMode ? "border-amber-700 bg-amber-900/30 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                {cameraError}
              </p>
            )}

            {!supportsBarcodeDetector && (
              <p className={`mt-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Browser does not support native QR detection. Use manual input section.
              </p>
            )}
          </section>

          <section className={`rounded-2xl border p-4 ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <button
              type="button"
              onClick={() => setManualOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                isDarkMode ? "bg-gray-700 text-gray-100 hover:bg-gray-600" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <span>Manual Verify</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${manualOpen ? "rotate-180" : ""}`} />
            </button>

            {manualOpen && (
              <div className="mt-3">
                <form onSubmit={handleManualVerify} className="space-y-3">
                  <textarea
                    value={manualInput}
                    onChange={(event) => setManualInput(event.target.value)}
                    placeholder="Paste QR text here (example: RAJA PARBA 2026 | ID:... | Name:... | Type:...)"
                    rows={4}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-900 text-gray-100 focus:ring-indigo-500"
                        : "border-gray-300 bg-white text-gray-800 focus:ring-indigo-300"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={verifying}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Verify Pass
                  </button>
                </form>

                {lastRawScan && (
                  <div className={`mt-4 rounded-lg border p-3 ${isDarkMode ? "border-gray-600 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                    <p className={`mb-1 text-xs font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Last Scanned Data</p>
                    <p className={`text-xs break-words ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{lastRawScan}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {result && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setResult(null)}
          >
            <section
              className={`w-full max-w-3xl rounded-2xl border p-5 shadow-2xl ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {result.status === "valid" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : result.status === "used" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColor[result.status] || statusColor.invalid}`}>
                    {result.status?.toUpperCase() || "INVALID"}
                  </span>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{result.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className={`rounded-lg p-1.5 ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {result.details ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard label="Booking ID" value={result.details.bookingId} icon={Ticket} />
                  <InfoCard label="Pass Type" value={result.details.passType} icon={QrCode} />
                  <InfoCard label="Name" value={result.details.name} icon={User} />
                  <InfoCard label="Status" value={result.details.bookingStatus} icon={ShieldCheck} />
                </div>
              ) : null}
            </section>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 break-words">{value || "N/A"}</p>
    </div>
  );
}
