// components/admin/raja-activity/SponsorsTab.jsx
"use client";
import { useEffect, useState } from 'react';
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
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useRajaActivityStore from '@/lib/stores/useRajaActivityStore';
import { format } from 'date-fns';

export default function SponsorsTab() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { sponsors, loading, fetchSponsors, deleteItem, setSelectedItem } = useRajaActivityStore();
  const [showActivityLog, setShowActivityLog] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Activity Log Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowActivityLog(!showActivityLog)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4" />
          {showActivityLog ? 'Hide' : 'Show'} Activity Log
        </button>
      </div>

      {showActivityLog ? (
        <ActivityLog />
      ) : (
        <div className={`rounded-xl border overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
              }`}>
                <tr>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Contact Person</th>
                  <th className="px-4 py-3 text-left">Contact Details</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Applied On</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id} className={
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }>
                    <td className="px-4 py-3">
                      <div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {sponsor.organization}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {sponsor.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {sponsor.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className={`text-xs flex items-center gap-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Mail className="w-3 h-3" />
                          {sponsor.email}
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Phone className="w-3 h-3" />
                          {sponsor.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className={`text-xs flex items-center gap-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <MapPin className="w-3 h-3" />
                          {sponsor.address}, {sponsor.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(sponsor.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {sponsor.createdAt ? format(new Date(sponsor.createdAt), 'dd MMM yyyy') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedItem(sponsor)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {admin?.role === 'super_admin' && (
                          <button
                            onClick={() => deleteItem('sponsor', sponsor.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {sponsors.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center">
                      <Building2 className={`w-12 h-12 mx-auto mb-3 ${
                        isDarkMode ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        No sponsors yet
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Activity Log Component
function ActivityLog() {
  const { isDarkMode } = useThemeStore();
  const { activityLogs, fetchActivityLogs } = useRajaActivityStore();

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

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
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {activityLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.timestamp ? format(new Date(log.timestamp), 'dd MMM yyyy HH:mm') : 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.adminName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    log.action === 'CREATE' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : log.action === 'UPDATE'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.details}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}