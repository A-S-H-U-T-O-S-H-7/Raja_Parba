import React from 'react';
import { Camera, UploadCloud, X } from 'lucide-react';

const FreePassAdditionalDetails = ({ errors, selectedFile, imagePreview, imageUploading, handleFileChange, clearFile }) => {
  return (
    <div className="rounded-xl border border-cyan-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Camera className="h-4 w-4 text-cyan-500" />
        Upload Photo
        <span className="text-xs font-normal text-slate-400">(optional)</span>
      </p>

      {errors.selfie && <p className="mb-2 text-xs text-red-600">{errors.selfie}</p>}

      <input id="free-pass-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {!imagePreview ? (
        <label
          htmlFor="free-pass-photo"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
            <UploadCloud className="h-5 w-5 text-cyan-600" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Tap to upload photo</span>
          <span className="text-xs text-slate-400">JPEG, PNG, WebP · max 5 MB</span>
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50/60 p-3">
          <img src={imagePreview} alt="Preview" className="h-16 w-16 shrink-0 rounded-lg border-2 border-cyan-400 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">Ready ✓</p>
            <p className="truncate text-xs text-slate-500">{selectedFile?.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Camera className="h-3 w-3" /> Keep face clearly visible
            </p>
            <button type="button" onClick={clearFile}
              className="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        </div>
      )}

      {imageUploading && <p className="mt-2 text-sm text-cyan-700">Uploading…</p>}
    </div>
  );
};

export default FreePassAdditionalDetails;