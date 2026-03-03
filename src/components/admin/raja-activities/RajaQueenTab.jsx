// components/admin/raja-activity/RajaQueenTab.jsx
"use client";
import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Clock, Crown, Edit, Mail, Phone, Trash2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useRajaActivityStore from '@/lib/stores/useRajaActivityStore';

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

const statusMeta = (status) => {
  const value = (status || 'pending').toLowerCase();
  if (value === 'confirmed' || value === 'approved') {
    return {
      label: 'Confirmed',
      icon: CheckCircle,
      classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
    };
  }
  if (value === 'rejected') {
    return {
      label: 'Rejected',
      icon: XCircle,
      classes: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
    };
  }
  return {
    label: 'Pending',
    icon: Clock,
    classes: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
  };
};

export default function RajaQueenTab() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { loading, rajaQueen, fetchRajaQueen, updateItemStatus, deleteItem } = useRajaActivityStore();

  const [editingItem, setEditingItem] = useState(null);
  const [editStatus, setEditStatus] = useState('confirmed');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRajaQueen();
  }, [fetchRajaQueen]);

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
        confirmButtonColor: '#7c3aed'
      });
      return;
    }

    setSaving(true);
    const result = await updateItemStatus(
      'queen',
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
      await Swal.fire({
        icon: 'success',
        title: 'Raja Queen updated',
        text: `Status changed to ${editStatus}.`,
        timer: 1400,
        showConfirmButton: false
      });
      closeEditModal();
    }
  };

  if (loading && rajaQueen.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`hidden overflow-hidden rounded-2xl border lg:block ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-slate-100 text-slate-700'}>
              <tr className="text-left text-sm font-semibold">
                <th className="px-5 py-3">Photo</th>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Applied</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-slate-200'}>
              {rajaQueen.map((item) => {
                const meta = statusMeta(item.status);
                const Icon = meta.icon;
                return (
                  <tr key={item.id} className={isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-slate-50'}>
                    <td className="px-5 py-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-rose-200 bg-slate-100">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.name || 'candidate'} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Raja Queen</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>{item.registrationId || item.id}</p>
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-rose-500" /> {item.email || 'N/A'}</p>
                      <p className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-rose-500" /> {item.phone || 'N/A'}</p>
                    </td>
                    <td className={`px-5 py-4 text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <p>Age: {item.age || 'N/A'} | DOB: {item.dob || 'N/A'}</p>
                      <p>Gender: {item.gender || 'N/A'} | Group: {item.ageGroup || 'N/A'}</p>
                      <p>Pincode: {item.pincode || 'N/A'}</p>
                      <p className="max-w-xs truncate">Location: {item.location || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${meta.classes}`}>
                        <Icon className="h-4 w-4" />
                        {meta.label}
                      </span>
                      {item.eventDate && (
                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                          Event Date: {formatDate(item.eventDate)} {item.eventTime ? `at ${item.eventTime}` : ''}
                        </p>
                      )}
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-rose-500" />
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {admin?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => deleteItem('queen', item.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
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
        {rajaQueen.map((item) => {
          const meta = statusMeta(item.status);
          const Icon = meta.icon;
          return (
            <div key={item.id} className={`rounded-2xl border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-slate-200 bg-white text-slate-800'}`}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-rose-200 bg-slate-100">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.name || 'candidate'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">N/A</div>
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
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-rose-500" /> {item.email || 'N/A'}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-rose-500" /> {item.phone || 'N/A'}</p>
                <p>Location: {item.location || 'N/A'}</p>
                <p>Age: {item.age || 'N/A'} | DOB: {item.dob || 'N/A'}</p>
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
                    onClick={() => deleteItem('queen', item.id)}
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

      {rajaQueen.length === 0 && !loading && (
        <div className={`rounded-2xl border p-10 text-center ${isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-slate-200 bg-white text-slate-500'}`}>
          <Crown className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No Raja Queen applications yet.</p>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Update Raja Queen Status</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              {editingItem.name || 'Candidate'} ({editingItem.registrationId || editingItem.id})
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>New Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {editStatus === 'confirmed' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Event Time</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                  placeholder="Add notes for this update..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400"
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
