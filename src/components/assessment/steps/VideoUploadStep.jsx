"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, UploadCloud, Video } from "lucide-react";

export default function VideoUploadStep({
  title,
  description,
  existingData,
  onSubmit,
  maxDurationSec = null,
  disabled = false,
}) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateVideoDuration = (inputFile) =>
    new Promise((resolve) => {
      if (!inputFile || !maxDurationSec) {
        resolve(true);
        return;
      }
      const url = URL.createObjectURL(inputFile);
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.onloadedmetadata = () => {
        const isValid = Number(probe.duration || 0) <= Number(maxDurationSec);
        URL.revokeObjectURL(url);
        resolve(isValid);
      };
      probe.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      probe.src = url;
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;
    setSubmitting(true);
    try {
      await onSubmit?.(file);
      setFile(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = async (inputFile) => {
    if (!inputFile) {
      setFile(null);
      setError("");
      return;
    }
    const valid = await validateVideoDuration(inputFile);
    if (!valid) {
      setError(
        `Video duration exceeds the allowed limit of ${Math.floor(Number(maxDurationSec) / 60)} minute.`
      );
      return;
    }
    setError("");
    setFile(inputFile);
  };

  return (
    <div className="rounded-3xl border border-rose-200 bg-white/95 p-4 shadow-lg md:p-5">
      <h3 className="text-center text-xl font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-center text-sm text-rose-700/90">{description}</p>
      <p className="mt-1 text-center text-[11px] text-slate-500">
        Upload can take some time for larger files depending on internet speed.
      </p>

      {existingData?.url && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <a
            href={existingData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
          >
            <Video className="h-3.5 w-3.5" />
            View uploaded video
          </a>
          <p className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Video uploaded successfully 🎉
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-rose-300 bg-rose-50/40 p-4 text-center">
          <div>
            <UploadCloud className="mx-auto h-5 w-5 text-rose-600" />
            <p className="mt-1 text-xs font-semibold text-rose-700">
              Upload Video {maxDurationSec ? `(max ${Math.floor(Number(maxDurationSec) / 60)} min)` : "(max 100 MB)"}
            </p>
            <p className="text-[11px] text-rose-600">MP4, MOV, WEBM</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            disabled={disabled}
          />
        </label>

        {file && (
          <p className="rounded-md border border-emerald-200 bg-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Video uploaded successfully 🎉
            </span>
          </p>
        )}
        {error && (
          <p className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!file || submitting || disabled}
            className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Submit Video
          </button>
        </div>
      </form>
    </div>
  );
}
