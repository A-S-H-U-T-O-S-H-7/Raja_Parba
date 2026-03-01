import React from 'react';
import { Camera, UploadCloud } from 'lucide-react';

const FreePassAdditionalDetails = ({
  errors,
  selectedFile,
  imagePreview,
  imageUploading,
  handleFileChange,
  clearFile,
}) => {
  return (
    <section className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Additional Details</h3>

      <label className="mb-1 block text-sm font-medium text-slate-700">Upload Photo *</label>
      {errors.selfie && <p className="mb-2 text-xs text-red-600">{errors.selfie}</p>}

      <input id="free-pass-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <label
        htmlFor="free-pass-photo"
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition ${
          selectedFile
            ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
            : 'border-slate-300 text-slate-500 hover:border-cyan-500 hover:bg-cyan-50'
        }`}
      >
        <UploadCloud className="h-5 w-5" />
        <span className="text-sm font-medium">
          {selectedFile ? selectedFile.name : 'Click to upload photo'}
        </span>
      </label>

      {imagePreview && (
        <div className="mt-4 flex items-start gap-3">
          <img
            src={imagePreview}
            alt="Upload preview"
            className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">Preview ready</p>
            <p className="text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Camera className="h-3 w-3" />
                Keep face clearly visible
              </span>
            </p>
            <button
              type="button"
              onClick={clearFile}
              className="mt-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {imageUploading && (
        <p className="mt-3 text-sm text-cyan-700">Uploading photo...</p>
      )}
    </section>
  );
};

export default FreePassAdditionalDetails;
