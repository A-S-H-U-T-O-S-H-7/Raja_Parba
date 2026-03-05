// components/admin/gallery/GalleryUploader.jsx
"use client";
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, CheckCircle, AlertCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useGalleryStore from '@/lib/stores/useGalleryStore';

export default function GalleryUploader({ onClose }) {
  const { isDarkMode } = useThemeStore();
  const { uploadImages, uploadProgress, uploadQueue } = useGalleryStore();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    await uploadImages(acceptedFiles);
    setUploading(false);
  }, [uploadImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${
      isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-white to-indigo-50/40 border-indigo-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Upload Images
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? isDarkMode
              ? 'border-purple-400 bg-purple-900/20 shadow-[0_0_0_4px_rgba(168,85,247,0.15)]'
              : 'border-purple-500 bg-purple-50 shadow-[0_0_0_4px_rgba(168,85,247,0.12)]'
            : isDarkMode
              ? 'border-gray-600 hover:border-purple-500 bg-gray-800/40'
              : 'border-indigo-300 hover:border-indigo-500 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-3 ${
          isDragActive ? 'text-purple-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop images here, or click to select'}
        </p>
        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Supports: JPG, PNG, GIF, WEBP (Max: 10MB each)
        </p>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Upload Queue ({uploadQueue.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadQueue.map((queueItem, index) => {
              const progress = uploadProgress[queueItem.id] || 0;
              return (
                <div key={index} className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Image className="w-4 h-4 text-purple-500" />
                    <span className={`text-xs flex-1 truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {queueItem.name}
                    </span>
                    {progress === 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className={`w-full rounded-full h-1.5 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
