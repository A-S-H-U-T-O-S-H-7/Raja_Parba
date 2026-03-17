// components/admin/users/UserTable.jsx
"use client";
import { Users, AlertCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useUserStore from '@/lib/stores/useUserStore';
import UserRow from './UserRow';
import TableSkeleton from './TableSkeleton';

export default function UserTable({ users = [] }) {
  const { isDarkMode } = useThemeStore();
  const { 
    loading, 
    error, 
    filters
  } = useUserStore();

  if (loading) {
    return <TableSkeleton columns={5} rows={5} />;
  }

  if (error) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${
          isDarkMode ? 'text-red-400' : 'text-red-500'
        }`} />
        <h3 className={`text-lg font-medium mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Failed to Load Users</h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={`rounded-xl border p-12 text-center ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Users className={`w-16 h-16 mx-auto mb-4 ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <h3 className={`text-lg font-medium mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>No Users Found</h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {filters.search || filters.status !== 'all' || filters.role !== 'all' || filters.signInMethod !== 'all'
            ? 'Try adjusting your filters to see more results.'
            : 'No users have registered yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border-2 shadow-sm ${
      isDarkMode ? 'border-indigo-700/50 bg-slate-900' : 'border-indigo-200 bg-white'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDarkMode
          ? 'bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-900 border-indigo-700/60'
          : 'bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 border-indigo-300'
      }`}>
        <p className={`text-sm font-semibold ${isDarkMode ? 'text-indigo-100' : 'text-indigo-900'}`}>
          Registered Users
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-semibold ${
            isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-indigo-50 text-slate-700'
          }`}>
            <tr>
              <th className="lg:hidden px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Expand</th>
              <th className="px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">User</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Status</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Sign-in Method</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left border-b border-indigo-100 dark:border-slate-700">Joined</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-slate-700' : 'divide-slate-200'
          }`}>
            {users.map((user, index) => (
              <UserRow 
                key={user.id} 
                user={user} 
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
