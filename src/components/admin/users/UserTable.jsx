// components/admin/users/UserTable.jsx
"use client";
import { useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useUserStore from '@/lib/stores/useUserStore';
import UserRow from './UserRow';
import TableSkeleton from './TableSkeleton';

export default function UserTable() {
  const { theme } = useThemeStore();
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
        theme === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${
          theme === "dark" ? 'text-red-400' : 'text-red-500'
        }`} />
        <h3 className={`text-lg font-medium mb-2 ${
          theme === "dark" ? 'text-white' : 'text-gray-900'
        }`}>Failed to Load Users</h3>
        <p className={`text-sm ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={`rounded-xl border p-12 text-center ${
        theme === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Users className={`w-16 h-16 mx-auto mb-4 ${
          theme === "dark" ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <h3 className={`text-lg font-medium mb-2 ${
          theme === "dark" ? 'text-white' : 'text-gray-900'
        }`}>No Users Found</h3>
        <p className={`text-sm ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
          {filters.search || filters.status !== 'all' || filters.role !== 'all' || filters.signInMethod !== 'all'
            ? 'Try adjusting your filters to see more results.'
            : 'No users have registered yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${
      theme === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-medium ${
            theme === "dark" ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
          }`}>
            <tr>
              <th className="lg:hidden px-4 py-3 text-left">Expand</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Status</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Sign-in Method</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === "dark" ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {users.map((user, index) => (
              <UserRow 
                key={user.id} 
                user={user} 
                index={index}
                onAction={(action, user) => {
                  // Handle row actions if needed
                  console.log('Action:', action, user);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}