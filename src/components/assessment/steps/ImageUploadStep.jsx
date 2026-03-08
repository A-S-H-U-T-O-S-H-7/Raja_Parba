"use client";

import { useState } from "react";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";

export default function ImageUploadStep({
  title,
  description,
  existingData,
  onSubmit,
  disabled = false,
}) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>

      {existingData?.url && (
        <a
          href={existingData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 text-xs font-semibold text-fuchsia-700"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Previously uploaded image
        </a>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-fuchsia-300 bg-fuchsia-50/40 p-4 text-center">
          <div>
            <UploadCloud className="mx-auto h-5 w-5 text-fuchsia-600" />
            <p className="mt-1 text-xs font-semibold text-fuchsia-700">Upload Image</p>
            <p className="text-[11px] text-fuchsia-600">JPG, PNG, WEBP</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={disabled}
          />
        </label>

        {file && (
          <p className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1.5 text-xs font-medium text-fuchsia-700">
            Selected: {file.name}
          </p>
        )}

        <button
          type="submit"
          disabled={!file || submitting || disabled}
          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Submit Image
        </button>
      </form>
    </div>
  );
}

