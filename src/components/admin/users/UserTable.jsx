// components/admin/users/UserTable.jsx
"use client";
import { useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useUserStore from '@/lib/stores/useUserStore';
import UserRow from './UserRow';
import TableSkeleton from './TableSkeleton';

export default function UserTable() {
  const { isDarkMode } = useThemeStore();
  const { 
    users, 
    loading, 
    error, 
    fetchUsers,
    filters
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${
      isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-medium ${
            isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'
          }`}>
            <tr>
              <th className="lg:hidden px-4 py-3 text-left">Expand</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Status</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Sign-in Method</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Joined</th>
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
