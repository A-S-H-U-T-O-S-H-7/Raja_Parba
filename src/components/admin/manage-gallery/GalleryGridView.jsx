// components/admin/gallery/GalleryGridView.jsx
"use client";
import Image from 'next/image';
import { 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useGalleryStore from '@/lib/stores/useGalleryStore';

export default function GalleryGridView({ images, onEdit }) {
  const { isDarkMode } = useThemeStore();
  const { 
    selectedImages, 
    toggleSelect, 
    selectAll, 
    clearSelection,
    toggleShowcase,
    deleteImage 
  } = useGalleryStore();

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={selectAll}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Select All
          </button>
          {selectedImages.length > 0 && (
            <button
              onClick={clearSelection}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clear ({selectedImages.length})
            </button>
          )}
        </div>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {images.length} images
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {images.map((image) => {
          const isSelected = selectedImages.includes(image.id);
          
          return (
            <div
              key={image.id}
              className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 shadow-lg'
                  : isDarkMode
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2 z-20">
                <button
                  onClick={() => toggleSelect(image.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </button>
              </div>

              {/* Showcase Badge */}
              <div className="absolute top-2 right-2 z-20">
                {image.showcase ? (
                  <div className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Showcase
                  </div>
                ) : (
                  <div className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Normal
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Overlay with Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button
                  onClick={() => onEdit(image)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleShowcase(image.id)}
                  className={`p-2 rounded-full ${
                    image.showcase
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                  title={image.showcase ? 'Remove from Showcase' : 'Add to Showcase'}
                >
                  {image.showcase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this image?')) deleteImage(image.id);
                  }}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <div className={`p-2 text-xs truncate ${
                isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
              }`}>
                {image.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}