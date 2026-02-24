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
    <div className={`rounded-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-medium ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
          }`}>
            <tr>
              <th className="lg:hidden px-4 py-3 text-left">Expand</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Username</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Role</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Permissions</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-left">Actions</th>
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