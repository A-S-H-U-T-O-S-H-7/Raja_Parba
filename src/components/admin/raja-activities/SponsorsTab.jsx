// components/admin/raja-activity/SponsorsTab.jsx
"use client";
import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  History,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useRajaActivityStore from '@/lib/stores/useRajaActivityStore';

const formatAppliedDate = (value) => {
  if (!value) return 'N/A';
  const dateValue = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return 'N/A';
  return format(dateValue, 'dd MMM yyyy');
};

const getStatusMeta = (statusValue) => {
  const status = (statusValue || 'requested').toLowerCase();

  switch (status) {
    case 'confirmed':
    case 'approved':
      return {
        label: 'Confirmed',
        classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
        icon: CheckCircle
      };
    case 'rejected':
      return {
        label: 'Rejected',
        classes: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
        icon: XCircle
      };
    case 'pending':
    case 'requested':
    default:
      return {
        label: 'Requested',
        classes: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
        icon: Clock
      };
  }
};

export default function SponsorsTab() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const {
    sponsors,
    loading,
    fetchSponsors,
    deleteItem,
    updateItemStatus,
    activityLogs,
    fetchActivityLogs
  } = useRajaActivityStore();

  const [showActivityLog, setShowActivityLog] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [editStatus, setEditStatus] = useState('confirmed');
  const [editNotes, setEditNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  useEffect(() => {
    if (showActivityLog) {
      fetchActivityLogs();
    }
  }, [showActivityLog, fetchActivityLogs]);

  const sortedLogs = useMemo(() => activityLogs || [], [activityLogs]);

  const openEditModal = (sponsor) => {
    const current = (sponsor?.status || sponsor?.reviewStatus || 'requested').toLowerCase();
    setEditingSponsor(sponsor);
    setEditStatus(current === 'rejected' ? 'rejected' : 'confirmed');
    setEditNotes(sponsor?.adminNotes || '');
  };

  const closeEditModal = () => {
    setEditingSponsor(null);
    setEditStatus('confirmed');
    setEditNotes('');
  };

  const handleUpdateStatus = async () => {
    if (!editingSponsor?.id) return;

    setSavingStatus(true);
    const result = await updateItemStatus('sponsor', editingSponsor.id, editStatus, editNotes.trim());
    setSavingStatus(false);

    if (result?.success) {
      await Swal.fire({
        title: 'Status Updated',
        text: `Sponsor status changed to ${editStatus}.`,
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });
      closeEditModal();
    }
  };

  if (loading && sponsors.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setShowActivityLog(!showActivityLog)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <History className="h-4 w-4" />
          {showActivityLog ? 'Hide Activity Log' : 'Show Activity Log'}
        </button>
      </div>

      {showActivityLog ? (
        <div
          className={`overflow-hidden rounded-2xl border ${
            isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-slate-100 text-slate-700'}>
                <tr className="text-left text-sm font-semibold">
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Admin</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-slate-200'}>
                {sortedLogs.map((log) => (
                  <tr key={log.id} className={isDarkMode ? 'text-gray-200' : 'text-slate-700'}>
                    <td className="px-5 py-3 text-sm">{formatAppliedDate(log.timestamp)}</td>
                    <td className="px-5 py-3 text-sm">{log.adminName || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm font-semibold">{log.action || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm">{log.category || 'N/A'}</td>
                    <td className="px-5 py-3 text-sm">{log.details || 'N/A'}</td>
                  </tr>
                ))}
                {sortedLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className={`px-5 py-8 text-center text-base ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}
                    >
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`hidden overflow-hidden rounded-2xl border lg:block ${
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-slate-100 text-slate-700'}>
                  <tr className="text-left text-sm font-semibold">
                    <th className="px-5 py-3">Organization</th>
                    <th className="px-5 py-3">Contact Details</th>
                    <th className="px-5 py-3">Address</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Applied</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-slate-200'}>
                  {sponsors.map((sponsor) => {
                    const statusMeta = getStatusMeta(sponsor.status);
                    const StatusIcon = statusMeta.icon;

                    return (
                      <tr key={sponsor.id} className={isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-slate-50'}>
                        <td className="px-5 py-4">
                          <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {sponsor.organization || 'N/A'}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{sponsor.name || 'N/A'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-amber-500" />
                              {sponsor.email || 'N/A'}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-amber-500" />
                              {sponsor.phone || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
                            <span>{sponsor.address || 'N/A'}{sponsor.city ? `, ${sponsor.city}` : ''}</span>
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${statusMeta.classes}`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            {formatAppliedDate(sponsor.createdAt)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(sponsor)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {admin?.role === 'super_admin' && (
                              <button
                                onClick={() => deleteItem('sponsor', sponsor.id)}
                                className="rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
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
                  {sponsors.length === 0 && (
                    <tr>
                      <td colSpan="6" className={`px-5 py-10 text-center ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        <Building2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
                        <p className="text-lg font-medium">No sponsor applications found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 lg:hidden">
            {sponsors.map((sponsor) => {
              const statusMeta = getStatusMeta(sponsor.status);
              const StatusIcon = statusMeta.icon;

              return (
                <div
                  key={sponsor.id}
                  className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-bold">{sponsor.organization || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{sponsor.name || 'N/A'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.classes}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-amber-500" /> {sponsor.email || 'N/A'}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-500" /> {sponsor.phone || 'N/A'}</p>
                    <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-amber-500" /> {sponsor.address || 'N/A'}{sponsor.city ? `, ${sponsor.city}` : ''}</p>
                    <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-amber-500" /> {formatAppliedDate(sponsor.createdAt)}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(sponsor)}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      <span className="inline-flex items-center gap-1"><Edit className="h-4 w-4" /> Edit</span>
                    </button>
                    {admin?.role === 'super_admin' && (
                      <button
                        onClick={() => deleteItem('sponsor', sponsor.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      >
                        <span className="inline-flex items-center gap-1"><Trash2 className="h-4 w-4" /> Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {sponsors.length === 0 && (
              <div
                className={`rounded-2xl border p-8 text-center ${
                  isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <Building2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">No sponsor applications found.</p>
              </div>
            )}
          </div>
        </>
      )}

      {editingSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Update Sponsor Status</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              {editingSponsor.organization || 'Sponsor'} ({editingSponsor.name || 'N/A'})
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                  New Status
                </label>
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

              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-slate-300 bg-white text-slate-900'
                  }`}
                  placeholder="Add notes about this decision..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={savingStatus}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400"
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
