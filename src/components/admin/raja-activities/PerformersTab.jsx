// components/admin/raja-activity/PerformersTab.jsx
"use client";
import { useEffect, useMemo, useState } from 'react';
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
import Pagination from '@/components/admin/shared/Pagination';
import ExportExcelButton from '@/components/admin/shared/ExportExcelButton';
import { buildExcelData, exportToExcel } from '@/utils/excelExport';

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

const statusBadge = (status, isDarkMode) => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const cellBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  useEffect(() => {
    fetchPerformers();
  }, [fetchPerformers]);

  const totalPages = Math.max(1, Math.ceil((performers?.length || 0) / itemsPerPage));
  const paginatedPerformers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return (performers || []).slice(startIndex, startIndex + itemsPerPage);
  }, [performers, currentPage]);

  const exportColumns = useMemo(() => ([
    { header: 'S.No', accessor: (_, index) => index + 1 },
    { header: 'Registration ID', accessor: (performer) => performer.registrationId || performer.id || 'N/A' },
    { header: 'Name', accessor: 'name' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'Performance Type', accessor: 'performanceType' },
    { header: 'Track Music Name', accessor: 'trackMusicName' },
    { header: 'Track Duration', accessor: 'trackDuration' },
    { header: 'Preferred Date', accessor: 'preferredDate' },
    { header: 'Participation Type', accessor: 'participationType' },
    { header: 'Group Name', accessor: 'groupName' },
    { header: 'Member Count', accessor: 'memberCount' },
    { header: 'Member Names', accessor: (performer) => performer.memberNames || [] },
    { header: 'Status', accessor: (performer) => statusBadge(performer.status, isDarkMode).label },
    { header: 'Performance Date', accessor: (performer) => formatDate(performer.performanceDate) },
    { header: 'Performance Time', accessor: 'performanceTime' },
    { header: 'Applied Date', accessor: (performer) => formatDate(performer.createdAt) },
    { header: 'Admin Notes', accessor: 'adminNotes' }
  ]), [isDarkMode]);

  const handleExport = () => {
    const excelData = buildExcelData(performers || [], exportColumns);
    exportToExcel(excelData, 'raja-performers.xls', {
      headerBgColor: '#0891b2',
      textColumns: ['registration id', 'phone']
    });
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
      <div className="flex justify-end">
        <ExportExcelButton onClick={handleExport} />
      </div>

      <div
        className={`hidden overflow-hidden rounded-2xl border lg:block ${
          isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={isDarkMode ? 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-blue-100' : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 text-indigo-900'}>
              <tr className="text-left text-xs font-bold uppercase tracking-wider">
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>S.No</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Performer</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Contact</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Address</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Performance</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Participation</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Status</th>
                <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Applied</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
              {paginatedPerformers.map((performer, index) => {
                const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                const meta = statusBadge(performer.status, isDarkMode);
                const Icon = meta.icon;
                return (
                  <tr key={performer.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-800/80' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass}`}>
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{String(serialNo).padStart(2, '0')}</span>
                    </td>
                    <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                      <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{performer.name || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{performer.gender || 'N/A'}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{performer.registrationId || performer.id}</p>
                    </td>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-500" /> {performer.email || 'N/A'}</p>
                      <p className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-500" /> {performer.phone || 'N/A'}</p>
                    </td>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p className="max-w-xs whitespace-pre-wrap break-words">{performer.address || 'N/A'}</p>
                    </td>
	                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
	                      <p className="font-semibold">{performer.performanceType || 'N/A'}</p>
	                      <p className="mt-1">{performer.trackMusicName || 'Track N/A'} ({performer.trackDuration || 'N/A'})</p>
	                      <p className="mt-1 text-xs">Preferred Date: {performer.preferredDate || 'N/A'}</p>
	                    </td>
	                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
	                      {performer.participationType === 'Group' ? (
	                        <div>
	                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
	                            isDarkMode
	                              ? 'bg-purple-900/40 text-purple-200 border-purple-700'
	                              : 'bg-purple-100 text-purple-800 border-purple-300'
	                          }`}>
	                            <Users className="mr-1 h-3.5 w-3.5" />
	                            Group
	                          </span>
	                          <p className="mt-1 text-xs">
	                            {performer.groupName || 'Group'} ({performer.memberCount || 0})
	                          </p>
	                        </div>
	                      ) : (
	                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
	                          isDarkMode
	                            ? 'bg-emerald-900/40 text-emerald-200 border-emerald-700'
	                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
	                        }`}>
	                          <UserCircle2 className="mr-1 h-3.5 w-3.5" />
	                          Solo
	                        </span>
	                      )}
	                      {performer.participationType === 'Group' && Array.isArray(performer.memberNames) && performer.memberNames.filter(Boolean).length > 0 && (
	                        <div className="mt-2 flex flex-wrap gap-1.5">
	                          {performer.memberNames.filter(Boolean).map((memberName, index) => (
	                            <span
	                              key={`${performer.id}-member-${index}`}
	                              className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
	                                isDarkMode
	                                  ? 'bg-cyan-900/40 text-cyan-200 border-cyan-700'
	                                  : 'bg-cyan-100 text-cyan-800 border-cyan-300'
	                              }`}
	                            >
	                              {memberName}
	                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${meta.classes}`}>
                        <Icon className="h-4 w-4" />
                        {meta.label}
                      </span>
                      {performer.performanceDate && (
                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Performance: {formatDate(performer.performanceDate)} {performer.performanceTime ? `at ${performer.performanceTime}` : ''}
                        </p>
                      )}
                    </td>
                    <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-500" />
                        {formatDate(performer.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(performer)}
                          className={isDarkMode ? "rounded-lg bg-blue-900/40 p-2 text-blue-300 border border-blue-700 hover:bg-blue-900/60" : "rounded-lg bg-indigo-100 p-2 text-indigo-700 border border-indigo-300 hover:bg-indigo-200"}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {admin?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => deleteItem('performer', performer.id)}
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
        {paginatedPerformers.map((performer) => {
          const meta = statusBadge(performer.status, isDarkMode);
          const Icon = meta.icon;
          return (
            <div
              key={performer.id}
              className={`rounded-2xl border p-4 ${
                isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-200 bg-white text-gray-800'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-bold">{performer.name || 'N/A'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{performer.performanceType || 'N/A'}</p>
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
	                <p>Preferred Date: {performer.preferredDate || 'N/A'}</p>
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

      {performers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={performers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          showPageSize={false}
          className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
        />
      )}

      {performers.length === 0 && !loading && (
        <div
          className={`rounded-2xl border p-10 text-center ${
            isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-white text-gray-500'
          }`}
        >
          <Mic className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No performers yet.</p>
        </div>
      )}

      {editingPerformer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Update Performer Status</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {editingPerformer.name || 'Performer'} ({editingPerformer.registrationId || editingPerformer.id})
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {editStatus === 'confirmed' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Performance Date</label>
                    <input
                      type="date"
                      value={performanceDate}
                      onChange={(e) => setPerformanceDate(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${
                        isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Performance Time</label>
                    <input
                      type="time"
                      value={performanceTime}
                      onChange={(e) => setPerformanceTime(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-sm ${
                        isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                      }`}
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
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
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
                  isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
