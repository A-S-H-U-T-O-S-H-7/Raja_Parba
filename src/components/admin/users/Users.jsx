// app/admin/users/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { Users, Download, RefreshCw } from 'lucide-react';
import useUserStore from '@/lib/stores/useUserStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import UserStatsCards from './UserStatsCards';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import Pagination from '../shared/Pagination';

export default function UsersPage() {
  const { isDarkMode } = useThemeStore();
  const { 
    users, 
    totalUsers, 
    fetchUsers,
    setCurrentPage: setStorePage,
    setPageSize: setStorePageSize,
    loading
  } = useUserStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch users when page or pageSize changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, fetchUsers]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setStorePage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
    setStorePageSize(size);
    setStorePage(1); // Reset store page as well
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleExport = () => {
    // Implement CSV export
    console.log('Export users');
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Status', 'Sign In Method', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        `"${user.displayName || ''}"`,
        `"${user.email}"`,
        user.status,
        user.signInMethod,
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            User Management
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and monitor all registered users
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            disabled={users.length === 0}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <UserStatsCards />

      {/* Filters */}
      <UserFilters />

      {/* Users Table */}
      <UserTable />

      {/* Pagination */}
      {totalUsers > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
          showFirstLast={true}
          showPageSize={true}
          showInfo={true}
        />
      )}
    </div>
  );
}
