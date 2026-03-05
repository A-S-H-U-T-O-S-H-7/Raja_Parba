"use client";
import { useState, useEffect } from 'react';
import { 
  Images, 
  Upload, 
  Grid3x3, 
  List,
  Trash2,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Download,
  RefreshCw
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useGalleryStore from '@/lib/stores/useGalleryStore';
import PermissionGate from '../PermissionGate';
import GalleryUploader from './GalleryUploader';
import GalleryGridView from './GalleryGridView';
import GalleryListView from './GalleryListView';
import GalleryEditModal from './GalleryEditModal';

export default function GalleryAdminPage() {
  const { isDarkMode } = useThemeStore();
  const { 
    images, 
    loading, 
    selectedImages, 
    fetchImages,
    clearSelection,
    bulkToggleShowcase,
    bulkDelete
  } = useGalleryStore();

  const [viewMode, setViewMode] = useState('grid');
  const [showUploader, setShowUploader] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [filterShowcase, setFilterShowcase] = useState('all');

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const filteredImages = images.filter(img => {
    if (filterShowcase === 'showcase') return img.showcase === true;
    if (filterShowcase === 'normal') return img.showcase === false;
    return true;
  });

  const handleBulkShowcase = async (value) => {
    if (selectedImages.length === 0) return;
    await bulkToggleShowcase(selectedImages, value);
    clearSelection();
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0 || !confirm(`Delete ${selectedImages.length} images?`)) return;
    await bulkDelete(selectedImages);
  };

  return (
    <PermissionGate permission="manage_gallery">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Gallery Management
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Upload and manage festival images ({images.length} total)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter */}
            <select
              value={filterShowcase}
              onChange={(e) => setFilterShowcase(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Images</option>
              <option value="showcase">Showcase Only</option>
              <option value="normal">Normal Only</option>
            </select>

            <button
              onClick={() => fetchImages()}
              className={`p-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-purple-700 transition-all"
            >
              <Upload className="w-4 h-4" />
              {showUploader ? 'Close Uploader' : 'Upload Images'}
            </button>
          </div>
        </div>

        {/* Uploader Section */}
        {showUploader && <GalleryUploader onClose={() => setShowUploader(false)} />}

        {/* Bulk Actions */}
        {selectedImages.length > 0 && (
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-purple-600" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedImages.length} images selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkShowcase(true)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-green-700"
                >
                  <Eye className="w-4 h-4" />
                  Mark as Showcase
                </button>
                <button
                  onClick={() => handleBulkShowcase(false)}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-gray-700"
                >
                  <EyeOff className="w-4 h-4" />
                  Remove Showcase
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={clearSelection}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery View */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : viewMode === 'grid' ? (
          <GalleryGridView 
            images={filteredImages} 
            onEdit={setEditingImage}
          />
        ) : (
          <GalleryListView 
            images={filteredImages}
            onEdit={setEditingImage}
          />
        )}

        {/* Edit Modal */}
        {editingImage && (
          <GalleryEditModal
            image={editingImage}
            onClose={() => setEditingImage(null)}
          />
        )}
      </div>
    </PermissionGate>
  );
}
