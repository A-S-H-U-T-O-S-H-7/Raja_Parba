"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ImagePlus, Loader2, UploadCloud, Video } from "lucide-react";

const getFieldIcon = (inputType = "") => (inputType === "video" ? Video : ImagePlus);

const validateVideoDuration = (file, maxDurationSec) =>
  new Promise((resolve) => {
    if (!file || !maxDurationSec) {
      resolve({ valid: true, durationSec: null });
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      const durationSec = Number(probe.duration || 0);
      URL.revokeObjectURL(url);
      resolve({ valid: durationSec <= maxDurationSec, durationSec });
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, durationSec: null });
    };
    probe.src = url;
  });

export default function MediaBundleStep({
  title,
  description,
  fields = [],
  existingData,
  onSubmit,
  disabled = false,
}) {
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const completedFiles = useMemo(() => Object.keys(existingData?.files || {}).length, [existingData]);

  const handleFileChange = async (field, nextFile) => {
    if (!nextFile) {
      setFiles((prev) => ({ ...prev, [field.key]: null }));
      return;
    }
    if (field.inputType === "video" && field.maxDurationSec) {
      const check = await validateVideoDuration(nextFile, field.maxDurationSec);
      if (!check.valid) {
        setError(`${field.label} exceeds allowed duration (${Math.floor(field.maxDurationSec / 60)} minute max).`);
        return;
      }
    }
    setError("");
    setFiles((prev) => ({ ...prev, [field.key]: nextFile }));
  };

  const isReady = fields.every((field) => Boolean(files?.[field.key]));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isReady) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit?.(files);
      setFiles({});
    } catch (err) {
      setError(err?.message || "Failed to submit files.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white/95 p-4 shadow-lg backdrop-blur md:p-6">
      <h3 className="text-center text-xl font-semibold text-emerald-900">{title}</h3>
      <p className="mt-1 text-center text-sm text-emerald-700/90">{description}</p>
      <p className="mt-1 text-center text-[11px] text-slate-500">
        Upload time depends on file size and internet speed, so video/image may take a little longer.
      </p>

      {completedFiles > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {Object.keys(existingData?.files || {}).map((key) => (
            <p key={key} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {key.toLowerCase().includes("video") ? "Video uploaded successfully" : "Image uploaded successfully"} {"\u{1F389}"}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {fields.map((field) => {
          const Icon = getFieldIcon(field.inputType);
          const existingFile = existingData?.files?.[field.key];
          return (
            <div key={field.key} className="rounded-2xl border border-teal-200 bg-teal-50/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800">
                  <Icon className="h-4 w-4" />
                  {field.label}
                </p>
                {field.maxDurationSec ? (
                  <span className="text-[11px] font-semibold text-teal-700">Max {Math.floor(field.maxDurationSec / 60)} min</span>
                ) : null}
              </div>

              {existingFile?.url && (
                <a
                  href={existingFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-xs font-semibold text-teal-700 underline underline-offset-2"
                >
                  View existing file
                </a>
              )}

              <label className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-teal-300 bg-white p-4 text-center">
                <div>
                  <UploadCloud className="mx-auto h-5 w-5 text-teal-600" />
                  <p className="mt-1 text-xs font-semibold text-teal-700">Choose {field.inputType} file</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept={field.accept}
                  onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
                  disabled={disabled || submitting}
                />
              </label>

              {files?.[field.key] && (
                <p className="mt-2 rounded-md border border-emerald-200 bg-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {field.inputType === "video" ? "Video uploaded successfully" : "Image uploaded successfully"} {"\u{1F389}"}
                  </span>
                </p>
              )}
            </div>
          );
        })}

        {error ? (
          <p className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!isReady || submitting || disabled}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Submit Files
        </button>
      </form>
    </div>
  );
}
