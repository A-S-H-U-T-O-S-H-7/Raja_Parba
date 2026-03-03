// components/admin/raja-activity/PerformersTab.jsx
"use client";
import { useEffect, useState } from 'react';
import {
  Mic,
  Users,
  UserCircle2,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
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

const statusBadge = (status) => {
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

export default function PerformersTab() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { performers, loading, fetchPerformers, deleteItem, updateItemStatus } = useRajaActivityStore();

  const [editingPerformer, setEditingPerformer] = useState(null);
  const [editStatus, setEditStatus] = useState('confirmed');
  const [performanceDate, setPerformanceDate] = useState('');
  const [performanceTime, setPerformanceTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    fetchPerformers();
  }, [fetchPerformers]);

  const openEditModal = (performer) => {
    setEditingPerformer(performer);
    setEditStatus((performer?.status || 'pending').toLowerCase() === 'rejected' ? 'rejected' : 'confirmed');
    setPerformanceDate(toDateInputValue(performer?.performanceDate));
    setPerformanceTime(performer?.performanceTime || '');
    setAdminNotes(performer?.adminNotes || '');
  };

  const closeEditModal = () => {
    setEditingPerformer(null);
    setEditStatus('confirmed');
    setPerformanceDate('');
    setPerformanceTime('');
    setAdminNotes('');
  };

  const handleSaveStatus = async () => {
    if (!editingPerformer?.id) return;
    if (editStatus === 'confirmed' && !performanceDate) {
      await Swal.fire({
        icon: 'warning',
        title: 'Performance date required',
        text: 'Please select a performance date before confirming.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setSavingStatus(true);
    const result = await updateItemStatus(
      'performer',
      editingPerformer.id,
      editStatus,
      adminNotes.trim(),
      {
        performanceDate: editStatus === 'confirmed' ? performanceDate : null,
        performanceTime: editStatus === 'confirmed' ? (performanceTime || null) : null
      }
    );
    setSavingStatus(false);

    if (result?.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Performer Updated',
        text: `Status changed to ${editStatus}.`,
        timer: 1400,
        showConfirmButton: false
      });
      closeEditModal();
    }
  };

  if (loading && performers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`hidden overflow-hidden rounded-2xl border lg:block ${
          isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-slate-100 text-slate-700'}>
              <tr className="text-left text-sm font-semibold">
                <th className="px-5 py-3">Performer</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Performance</th>
                <th className="px-5 py-3">Participation</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Applied</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-slate-200'}>
              {performers.map((performer) => {
                const meta = statusBadge(performer.status);
                const Icon = meta.icon;
                return (
                  <tr key={performer.id} className={isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-slate-50'}>
                    <td className="px-5 py-4">
                      <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{performer.name || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{performer.gender || 'N/A'}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>{performer.registrationId || performer.id}</p>
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-500" /> {performer.email || 'N/A'}</p>
                      <p className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-500" /> {performer.phone || 'N/A'}</p>
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <p className="max-w-xs whitespace-pre-wrap break-words">{performer.address || 'N/A'}</p>
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <p className="font-semibold">{performer.performanceType || 'N/A'}</p>
                      <p className="mt-1">{performer.trackMusicName || 'Track N/A'} ({performer.trackDuration || 'N/A'})</p>
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      {performer.participationType === 'Group' ? (
                        <div>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            Group
                          </span>
                          <p className="mt-1 text-xs">
                            {performer.groupName || 'Group'} ({performer.memberCount || 0})
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <UserCircle2 className="mr-1 h-3.5 w-3.5" />
                          Solo
                        </span>
                      )}
                      {performer.participationType === 'Group' && Array.isArray(performer.memberNames) && performer.memberNames.filter(Boolean).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {performer.memberNames.filter(Boolean).map((memberName, index) => (
                            <span
                              key={`${performer.id}-member-${index}`}
                              className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200"
                            >
                              {memberName}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${meta.classes}`}>
                        <Icon className="h-4 w-4" />
                        {meta.label}
                      </span>
                      {performer.performanceDate && (
                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                          Performance: {formatDate(performer.performanceDate)} {performer.performanceTime ? `at ${performer.performanceTime}` : ''}
                        </p>
                      )}
                    </td>
                    <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-500" />
                        {formatDate(performer.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(performer)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {admin?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => deleteItem('performer', performer.id)}
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
        {performers.map((performer) => {
          const meta = statusBadge(performer.status);
          const Icon = meta.icon;
          return (
            <div
              key={performer.id}
              className={`rounded-2xl border p-4 ${
                isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-bold">{performer.name || 'N/A'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{performer.performanceType || 'N/A'}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.classes}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {meta.label}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-500" /> {performer.email || 'N/A'}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-500" /> {performer.phone || 'N/A'}</p>
                <p className="whitespace-pre-wrap break-words">{performer.address || 'N/A'}</p>
                <p className="font-semibold">
                  {performer.participationType === 'Group'
                    ? `Group: ${performer.groupName || 'Group'} (${performer.memberCount || 0})`
                    : 'Solo'}
                </p>
                <p className="text-xs opacity-80">{performer.registrationId || performer.id}</p>
                {performer.participationType === 'Group' && Array.isArray(performer.memberNames) && performer.memberNames.filter(Boolean).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {performer.memberNames.filter(Boolean).map((memberName, index) => (
                      <span
                        key={`${performer.id}-mobile-member-${index}`}
                        className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200"
                      >
                        {memberName}
                      </span>
                    ))}
                  </div>
                )}
                {performer.performanceDate && (
                  <p className="text-xs">
                    Performance: {formatDate(performer.performanceDate)} {performer.performanceTime ? `at ${performer.performanceTime}` : ''}
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(performer)}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  Edit
                </button>
                {admin?.role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => deleteItem('performer', performer.id)}
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

      {performers.length === 0 && !loading && (
        <div
          className={`rounded-2xl border p-10 text-center ${
            isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-slate-200 bg-white text-slate-500'
          }`}
        >
          <Mic className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No performers yet.</p>
        </div>
      )}

      {editingPerformer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Update Performer Status</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              {editingPerformer.name || 'Performer'} ({editingPerformer.registrationId || editingPerformer.id})
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>New Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                  }`}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {editStatus === 'confirmed' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Performance Date</label>
                    <input
                      type="date"
                      value={performanceDate}
                      onChange={(e) => setPerformanceDate(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${
                        isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Performance Time</label>
                    <input
                      type="time"
                      value={performanceTime}
                      onChange={(e) => setPerformanceTime(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${
                        isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                      }`}
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
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                  }`}
                  placeholder="Add notes for this update..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={savingStatus}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-400"
              >
                {savingStatus ? 'Saving...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
