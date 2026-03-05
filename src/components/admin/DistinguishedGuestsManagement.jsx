"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import {
  createDistinguishedGuest,
  deleteDistinguishedGuest,
  updateDistinguishedGuest,
  uploadGuestImage
} from '@/lib/distinguishedGuestsService';
import { DEFAULT_GUEST, GUEST_CATEGORIES } from '@/lib/guestConstants';
import useGuestStore from '@/lib/stores/useGuestStore';
import useThemeStore from '@/lib/stores/useThemeStore';

const FILTERS = [
  { id: 'all', label: 'All Guests' },
  { id: 'special', label: 'Special Guest' },
  { id: 'spiritual', label: 'Spiritual Guru' },
  { id: 'artist', label: 'Artist' }
];

const CATEGORY_LABELS = {
  all: 'All Guests',
  special: 'Special Guest',
  spiritual: 'Spiritual Guru',
  artist: 'Artist'
};

const AdminGuests = () => {
  const { adminGuests, loading, fetchAdminGuests } = useGuestStore();
  const { isDarkMode } = useThemeStore();

  const [actionLoading, setActionLoading] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_GUEST);
  const [uploading, setUploading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const loadGuests = async () => {
    try {
      const result = await fetchAdminGuests();

      if (!result.success) {
        if (result.error?.includes('index is currently building')) {
          toast.error('Database index is building. Try refresh after 1-2 minutes.');
        } else {
          toast.error(`Failed to load guests: ${result.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      toast.error(`Error loading guests: ${error.message}`);
    }
  };

  const resetForm = () => {
    setEditingGuest(null);
    setFormData(DEFAULT_GUEST);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const result = editingGuest
        ? await updateDistinguishedGuest(editingGuest.id, formData)
        : await createDistinguishedGuest(formData);

      if (!result.success) {
        toast.error(`Error: ${result.error}`);
        return;
      }

      await loadGuests();
      resetForm();
      toast.success(editingGuest ? 'Guest updated successfully' : 'Guest created successfully');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setFormData({
      ...guest,
      name: guest.name || '',
      title: guest.title || '',
      description: guest.description || '',
      category: guest.category || 'spiritual',
      order: guest.order || 0,
      isActive: guest.isActive !== undefined ? guest.isActive : true,
      isExpected: guest.isExpected !== undefined ? guest.isExpected : false,
      significance: guest.significance || '',
      imageUrl: guest.imageUrl || '',
      imagePath: guest.imagePath || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete guest?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const response = await deleteDistinguishedGuest(id);
      if (!response.success) {
        toast.error(`Error: ${response.error}`);
        return;
      }
      await loadGuests();
      toast.success('Guest deleted successfully');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadGuestImage(file, editingGuest?.id || 'new');
      if (!result.success) {
        toast.error(`Error uploading image: ${result.error}`);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.imageUrl,
        imagePath: result.imagePath
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const guests = adminGuests || [];

  const sortedGuests = useMemo(() => {
    const list = [...guests].sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '');
    });
    return activeFilter === 'all' ? list : list.filter((item) => item.category === activeFilter);
  }, [guests, activeFilter]);

  const countByCategory = useMemo(
    () => ({
      all: guests.length,
      spiritual: guests.filter((g) => g.category === 'spiritual').length,
      artist: guests.filter((g) => g.category === 'artist').length,
      special: guests.filter((g) => g.category === 'special').length
    }),
    [guests]
  );

  if ((loading || actionLoading) && guests.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Loading guests...</p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            If new data was added, index sync may take a short time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen border rounded-2xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Manage Distinguished Guests
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Add, edit and manage special guests, spiritual gurus and artists.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="bg-gray-600 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Add New Guest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {FILTERS.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {countByCategory[item.id]}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{CATEGORY_LABELS[item.id]}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {FILTERS.map((item) => {
            const selected = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selected
                    ? 'bg-purple-600 text-white border-purple-600'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {CATEGORY_LABELS[item.id]} ({countByCategory[item.id]})
              </button>
            );
          })}
        </div>

        {showForm && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={resetForm}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${
              isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {editingGuest ? 'Edit Guest' : 'Add New Guest'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className={isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Significance</label>
                    <textarea
                      rows={2}
                      value={formData.significance}
                      onChange={(e) => setFormData((prev) => ({ ...prev, significance: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      >
                        {Object.entries(GUEST_CATEGORIES).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Display Order</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Active (visible)</span>
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.isExpected || false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isExpected: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Expected</span>
                    </label>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                    {uploading && <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uploading image...</p>}

                    {formData.imageUrl && (
                      <div className="mt-2 flex items-center gap-4">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/120/120';
                          }}
                        />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Image preview</span>
                      </div>
                    )}
                  </div>

                  <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      type="submit"
                      disabled={actionLoading || uploading}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? 'Saving...' : editingGuest ? 'Update Guest' : 'Create Guest'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {sortedGuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGuests.map((guest) => {
              const category = GUEST_CATEGORIES[guest.category] || GUEST_CATEGORIES.spiritual;
              return (
                <div
                  key={guest.id}
                  className={`rounded-xl shadow-sm border overflow-hidden transition-all duration-200 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${category.gradient} p-0.5`}>
                        <div className={`w-full h-full rounded-full p-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                          <img
                            src={guest.imageUrl || '/api/placeholder/120/120'}
                            alt={guest.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/120/120';
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg mb-1 truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{guest.name}</h3>
                        <p className={`text-sm mb-1 line-clamp-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{guest.title}</p>
                        <p className={`text-xs mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{guest.description}</p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className={isDarkMode ? 'px-2 py-1 rounded-full bg-gray-700 text-gray-200' : 'px-2 py-1 rounded-full bg-gray-100 text-gray-800'}>
                            {category.label}
                          </span>
                          <span className={isDarkMode ? 'px-2 py-1 rounded-full bg-gray-700 text-gray-200' : 'px-2 py-1 rounded-full bg-gray-100 text-gray-800'}>
                            Order: {guest.order || 0}
                          </span>
                          <span className={`px-2 py-1 rounded-full ${!guest.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {guest.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {guest.isExpected && <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Expected</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(guest)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-12 rounded-xl shadow-sm border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>No Guests Found</h3>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No records in {CATEGORY_LABELS[activeFilter]}.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setRetryCount((prev) => prev + 1)}
                className="bg-gray-600 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white py-2 px-6 rounded-md font-medium hover:bg-purple-700 transition-colors"
              >
                Add Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuests;
