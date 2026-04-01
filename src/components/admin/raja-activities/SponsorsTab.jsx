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

const formatAppliedDate = (value) => {
  if (!value) return 'N/A';
  const dateValue = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return 'N/A';
  return format(dateValue, 'dd MMM yyyy');
};

const getStatusMeta = (statusValue, isDarkMode) => {
  const status = (statusValue || 'requested').toLowerCase();

  switch (status) {
    case 'confirmed':
    case 'approved':
      return {
        label: 'Confirmed',
        classes: isDarkMode
          ? 'bg-emerald-900/50 text-emerald-200 border-emerald-600'
          : 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle
      };
    case 'rejected':
      return {
        label: 'Rejected',
        classes: isDarkMode
          ? 'bg-rose-900/50 text-rose-200 border-rose-600'
          : 'bg-rose-100 text-rose-800 border-rose-300',
        icon: XCircle
      };
    case 'pending':
    case 'requested':
    default:
      return {
        label: 'Requested',
        classes: isDarkMode
          ? 'bg-amber-900/50 text-amber-200 border-amber-600'
          : 'bg-amber-100 text-amber-800 border-amber-300',
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
    updateItemStatus
  } = useRajaActivityStore();

  const showActivityLog = false;
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [editStatus, setEditStatus] = useState('confirmed');
  const [editNotes, setEditNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortedLogs = [];
  const cellBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-300';

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const totalPages = Math.max(1, Math.ceil((sponsors?.length || 0) / itemsPerPage));
  const paginatedSponsors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return (sponsors || []).slice(startIndex, startIndex + itemsPerPage);
  }, [sponsors, currentPage]);

  const exportColumns = useMemo(() => ([
    { header: 'S.No', accessor: (_, index) => index + 1 },
    { header: 'Registration ID', accessor: (sponsor) => sponsor.registrationId || sponsor.id || 'N/A' },
    { header: 'Organization', accessor: 'organization' },
    { header: 'Contact Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: 'City', accessor: 'city' },
    { header: 'Status', accessor: (sponsor) => getStatusMeta(sponsor.status, isDarkMode).label },
    { header: 'Applied Date', accessor: (sponsor) => formatAppliedDate(sponsor.createdAt) },
    { header: 'Admin Notes', accessor: 'adminNotes' }
  ]), [isDarkMode]);

  const handleExport = () => {
    const excelData = buildExcelData(sponsors || [], exportColumns);
    exportToExcel(excelData, 'raja-sponsors.xls', {
      headerBgColor: '#b45309',
      textColumns: ['registration id', 'phone']
    });
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
        <ExportExcelButton onClick={handleExport} />
      </div>

      {showActivityLog ? (
        <div
          className={`overflow-hidden rounded-2xl border ${
            isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}>
                <tr className="text-left text-sm font-semibold">
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Admin</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
                {sortedLogs.map((log) => (
                  <tr key={log.id} className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
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
                      className={`px-5 py-8 text-center text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
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
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={isDarkMode ? 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-blue-100' : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 text-indigo-900'}>
                  <tr className="text-left text-xs font-bold uppercase tracking-wider">
                    <th className={`px-4 py-3 border-r ${cellBorderClass}`}>S.No</th>
                    <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Organization</th>
                    <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Contact Details</th>
                    <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Address</th>
                    <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Status</th>
                    <th className={`px-4 py-3 border-r ${cellBorderClass}`}>Applied</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
                  {paginatedSponsors.map((sponsor, index) => {
                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                    const statusMeta = getStatusMeta(sponsor.status, isDarkMode);
                    const StatusIcon = statusMeta.icon;

                    return (
                      <tr key={sponsor.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-800/80' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <td className={`px-4 py-4 text-sm border-r ${cellBorderClass}`}>
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{String(serialNo).padStart(2, '0')}</span>
                        </td>
                        <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                          <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {sponsor.organization || 'N/A'}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{sponsor.name || 'N/A'}</p>
                        </td>
                        <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                          <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                        <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
                            <span>{sponsor.address || 'N/A'}{sponsor.city ? `, ${sponsor.city}` : ''}</span>
                          </p>
                        </td>
                        <td className={`px-4 py-4 border-r ${cellBorderClass}`}>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${statusMeta.classes}`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-sm border-r ${cellBorderClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            {formatAppliedDate(sponsor.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(sponsor)}
                              className={isDarkMode ? "rounded-lg bg-blue-900/40 p-2 text-blue-300 border border-blue-700 hover:bg-blue-900/60" : "rounded-lg bg-indigo-100 p-2 text-indigo-700 border border-indigo-300 hover:bg-indigo-200"}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            {admin?.role === 'super_admin' && (
                              <button
                                onClick={() => deleteItem('sponsor', sponsor.id)}
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
                  {sponsors.length === 0 && (
                    <tr>
                      <td colSpan="6" className={`px-5 py-10 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
            {paginatedSponsors.map((sponsor) => {
              const statusMeta = getStatusMeta(sponsor.status, isDarkMode);
              const StatusIcon = statusMeta.icon;

              return (
                <div
                  key={sponsor.id}
                  className={`rounded-2xl border p-4 ${
                    isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-bold">{sponsor.organization || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{sponsor.name || 'N/A'}</p>
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
                  isDarkMode ? 'border-gray-700 bg-gray-900 text-gray-400' : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                <Building2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">No sponsor applications found.</p>
              </div>
            )}
          </div>
        </>
      )}

      {sponsors.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sponsors.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          showPageSize={false}
          className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
        />
      )}

      {editingSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Update Sponsor Status</h3>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {editingSponsor.organization || 'Sponsor'} ({editingSponsor.name || 'N/A'})
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Status
                </label>
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

              <div>
                <label className={`mb-2 block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-2 text-sm ${
                    isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Add notes about this decision..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
