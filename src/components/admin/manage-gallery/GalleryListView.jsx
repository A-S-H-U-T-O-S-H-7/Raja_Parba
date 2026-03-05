// components/admin/gallery/GalleryListView.jsx
"use client";
import { 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';
import { format } from 'date-fns';
import useThemeStore from '@/lib/stores/useThemeStore';
import useGalleryStore from '@/lib/stores/useGalleryStore';

export default function GalleryListView({ images, onEdit }) {
  const { isDarkMode } = useThemeStore();
  const { 
    selectedImages, 
    toggleSelect, 
    toggleShowcase,
    deleteImage 
  } = useGalleryStore();

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-medium ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
          }`}>
            <tr>
              <th className="px-4 py-3 text-left w-10">
                <button
                  onClick={() => {}}
                  className="hover:text-purple-600"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">Preview</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Uploaded</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {images.map((image) => (
              <tr key={image.id} className={isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                {/* Select */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleSelect(image.id)}
                    className={`p-1 rounded ${
                      selectedImages.includes(image.id)
                        ? 'text-purple-600'
                        : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {selectedImages.includes(image.id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </td>

                {/* Preview */}
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/120/120';
                      }}
                    />
                  </div>
                </td>

                {/* Title */}
                <td className="px-4 py-3">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {image.title}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {image.filename}
                  </div>
                </td>

                {/* Status */}
	                <td className="px-4 py-3">
	                  {image.showcase ? (
	                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
	                      isDarkMode
	                        ? 'bg-green-900/30 text-green-300'
	                        : 'bg-green-100 text-green-800'
	                    }`}>
	                      <Eye className="w-3 h-3 mr-1" />
	                      Showcase
	                    </span>
	                  ) : (
	                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
	                      isDarkMode
	                        ? 'bg-gray-700 text-gray-300'
	                        : 'bg-gray-100 text-gray-800'
	                    }`}>
	                      <EyeOff className="w-3 h-3 mr-1" />
	                      Normal
	                    </span>
	                  )}
	                </td>

                {/* Size */}
                <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatBytes(image.size)}
                </td>

                {/* Uploaded */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {image.createdAt ? format(new Date(image.createdAt), 'dd MMM yyyy') : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
	                    <button
	                      onClick={() => onEdit(image)}
	                      className={`p-1.5 rounded-lg ${
	                        isDarkMode
	                          ? 'hover:bg-gray-700 text-blue-400'
	                          : 'hover:bg-gray-100 text-blue-600'
	                      }`}
	                      title="Edit"
	                    >
                      <Edit className="w-4 h-4" />
                    </button>
	                    <button
	                      onClick={() => toggleShowcase(image.id)}
	                      className={`p-1.5 rounded-lg ${
	                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
	                      } ${
	                        image.showcase
	                          ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
	                          : isDarkMode ? 'text-green-400' : 'text-green-600'
	                      }`}
	                      title={image.showcase ? 'Remove from Showcase' : 'Add to Showcase'}
	                    >
                      {image.showcase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
	                    <button
	                      onClick={() => {
	                        if (confirm('Delete this image?')) deleteImage(image.id);
	                      }}
	                      className={`p-1.5 rounded-lg ${
	                        isDarkMode
	                          ? 'hover:bg-gray-700 text-red-400'
	                          : 'hover:bg-gray-100 text-red-600'
	                      }`}
	                      title="Delete"
	                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
