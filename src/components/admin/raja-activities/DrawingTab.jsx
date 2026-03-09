// components/admin/raja-activity/DrawingTab.jsx
"use client";
import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, Clock, Edit, Mail, Palette, Phone, Trash2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useRajaActivityStore from '@/lib/stores/useRajaActivityStore';
import Pagination from '@/components/admin/shared/Pagination';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return format(parsed, 'dd MMM yyyy');
};

const toDateInputValue = (value) => {
  if (!value) return '';
  const parsed = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return format(parsed, 'yyyy-MM-dd');
};

const statusMeta = (status, isDarkMode) => {
  const value = (status || 'pending').toLowerCase();
  if (value === 'confirmed' || value === 'approved') {
    return {
      label: 'Confirmed',
      icon: CheckCircle,
      classes: isDarkMode
        ? 'bg-emerald-900/50 text-emerald-200 border-emerald-600'
        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
  if (value === 'rejected') {
    return {
      label: 'Rejected',
      icon: XCircle,
      classes: isDarkMode
        ? 'bg-rose-900/50 text-rose-200 border-rose-600'
        : 'bg-rose-100 text-rose-800 border-rose-300'
    };
  }
  return {
    label: 'Pending',
    icon: Clock,
    classes: isDarkMode
      ? 'bg-amber-900/50 text-amber-200 border-amber-600'
      : 'bg-amber-100 text-amber-800 border-amber-300'
  };
};

export default function DrawingTab() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { loading, drawings, fetchDrawings, updateItemStatus, deleteItem } = useRajaActivityStore();

  const [editingItem, setEditingItem] = useState(null);
  const [editStatus, setEditStatus] = useState('confirmed');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cellBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  useEffect(() => {
    fetchDrawings();
  }, [fetchDrawings]);

  const totalPages = Math.max(1, Math.ceil((drawings?.length || 0) / itemsPerPage));
  const paginatedDrawings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return (drawings || []).slice(startIndex, startIndex + itemsPerPage);
  }, [drawings, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditStatus((item?.status || 'pending').toLowerCase() === 'rejected' ? 'rejected' : 'confirmed');
    setEventDate(toDateInputValue(item?.eventDate));
    setEventTime(item?.eventTime || '');
    setAdminNotes(item?.adminNotes || '');
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditStatus('confirmed');
    setEventDate('');
    setEventTime('');
    setAdminNotes('');
  };

  const handleSave = async () => {
    if (!editingItem?.id) return;
    if (editStatus === 'confirmed' && !eventDate) {
      await Swal.fire({
        icon: 'warning',
        title: 'Event date required',
        text: 'Please select event date before confirming.',
        confirmButtonColor: '#059669'
      });
      return;
    }

    setSaving(true);
    const result = await updateItemStatus(
      'drawing',
      editingItem.id,
      editStatus,
      adminNotes.trim(),
      {
        eventDate: editStatus === 'confirmed' ? eventDate : null,
        eventTime: editStatus === 'confirmed' ? (eventTime || null) : null
      }
    );
    setSaving(false);

    if (result?.success) {
      closeEditModal();
    }
  };

  if (loading && drawings.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`hidden overflow-hidden rounded-2xl border lg:block ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={isDarkMode ? 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-blue-100' : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 text-indigo-900'}>
              <tr className="text-left text-xs font-bold uppercase tracking-wider">
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>S.No</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Photo</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Candidate</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Contact</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Details</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Status</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Applied</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
              {paginatedDrawings.map((item, index) => {
                const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                const meta = statusMeta(item.status, isDarkMode);
                const Icon = meta.icon;
                return (
                  <tr key={item.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-800/80' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass}`}>
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{String(serialNo).padStart(2, '0')}</span>
                    </td>
                    <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-emerald-200 bg-gray-100">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.name || 'candidate'} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                      <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Drawing</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.registrationId || item.id}</p>
                    </td>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-500" /> {item.email || 'N/A'}</p>
                      <p className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-500" /> {item.phone || 'N/A'}</p>
                    </td>
                    <td className={`px-4 py-4 text-sm leading-6 border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p>Age: {item.age || 'N/A'} | DOB: {item.dob || 'N/A'}</p>
                      <p>Gender: {item.gender || 'N/A'} | Category: {item.category || 'N/A'}</p>
                      <p>Pincode: {item.pincode || 'N/A'}</p>
                      <p className="max-w-xs truncate">Location: {item.location || 'N/A'}</p>
                    </td>
                    <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${meta.classes}`}>
                        <Icon className="h-4 w-4" />
                        {meta.label}
                      </span>
                      {item.eventDate && (
                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Event Date: {formatDate(item.eventDate)} {item.eventTime ? `at ${item.eventTime}` : ''}
                        </p>
                      )}
                    </td>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className={isDarkMode ? "rounded-lg bg-blue-900/40 p-2 text-blue-300 border border-blue-700 hover:bg-blue-900/60" : "rounded-lg bg-indigo-100 p-2 text-indigo-700 border border-indigo-300 hover:bg-indigo-200"}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {admin?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => deleteItem('drawing', item.id)}
                            className={isDarkMode ? "rounded-lg bg-red-900/40 p-2 text-red-300 border border-red-700 hover:bg-red-900/60" : "rounded-lg bg-rose-100 p-2 text-rose-700 border border-rose-300 hover:bg-rose-200"}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {paginatedDrawings.map((item) => {
          const meta = statusMeta(item.status, isDarkMode);
          const Icon = meta.icon;
          return (
            <div key={item.id} className={`rounded-2xl border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-200 bg-white text-gray-800'}`}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-emerald-200 bg-gray-100">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.name || 'candidate'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">N/A</div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold">{item.name || 'N/A'}</p>
                    <p className="text-xs opacity-80">{item.registrationId || item.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.classes}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {meta.label}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-500" /> {item.email || 'N/A'}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-500" /> {item.phone || 'N/A'}</p>
                <p>Location: {item.location || 'N/A'}</p>
                <p>Category: {item.category || 'N/A'} | Age: {item.age || 'N/A'}</p>
                {item.eventDate && <p>Event Date: {formatDate(item.eventDate)} {item.eventTime ? `at ${item.eventTime}` : ''}</p>}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  Edit
                </button>
                {admin?.role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => deleteItem('drawing', item.id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {drawings.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={drawings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          showPageSize={false}
          className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
        />
      )}

      {drawings.length === 0 && !loading && (
        <div className={`rounded-2xl border p-10 text-center ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-white text-gray-500'}`}>
          <Palette className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No drawing applications yet.</p>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Update Drawing Status</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {editingItem.name || 'Candidate'} ({editingItem.registrationId || editingItem.id})
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {editStatus === 'confirmed' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Event Time</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Add notes for this update..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {saving ? 'Saving...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
