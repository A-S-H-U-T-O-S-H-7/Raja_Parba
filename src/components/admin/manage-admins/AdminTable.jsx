// components/admin/admins/AdminTable.jsx
"use client";
import { useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminManagementStore from '@/lib/stores/useAdminManagementStore';
import AdminRow from './AdminRow';

export default function AdminTable() {
  const { isDarkMode } = useThemeStore();
  const { admins, loading, error, fetchAdmins } = useAdminManagementStore();

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  if (loading) {
    return (
      <div className={`rounded-xl border p-8 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading admins...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border p-8 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Failed to Load Admins
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className={`rounded-xl border p-12 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col items-center justify-center text-center">
          <Users className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No Admins Found
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Click the "Add Admin" button to create your first admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border-2 overflow-visible shadow-sm ${
      isDarkMode ? 'bg-slate-900 border-indigo-700/50' : 'bg-white border-indigo-200'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDarkMode
          ? 'bg-gradient-to-r from-indigo-950 via-violet-900 to-blue-900 border-indigo-700/60'
          : 'bg-gradient-to-r from-indigo-100 via-violet-100 to-blue-100 border-indigo-300'
      }`}>
        <p className={`text-sm font-semibold ${isDarkMode ? 'text-indigo-100' : 'text-indigo-900'}`}>
          Admin Accounts
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-semibold ${
            isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-indigo-50 text-slate-700'
          }`}>
            <tr>
              <th className="lg:hidden px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Expand</th>
              <th className="px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Admin</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Username</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Role</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Permissions</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Last Login</th>
              <th className="px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {admins.map((admin, index) => (
              <AdminRow key={admin.id} admin={admin} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
