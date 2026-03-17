"use client";
import { useEffect, useMemo } from 'react';
import { ArrowLeft, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/lib/stores/useUserStore';
import useThemeStore from '@/lib/stores/useThemeStore';
import UserStatsCards from './UserStatsCards';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import Pagination from '../shared/Pagination';

export default function UsersPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const isDark = isDarkMode;
  const { 
    users, 
    totalUsers, 
    fetchUsers,
    setCurrentPage: setStorePage,
    pagination,
    loading
  } = useUserStore();

  const currentPage = pagination.page;
  const pageSize = pagination.limit;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return users.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, users]);

  const handlePageChange = (page) => {
    setStorePage(page);
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
    <div className="min-h-screen transition-colors duration-300 p-0 md:p-4 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => router.back()}
              className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
            </button>
            <div className={`p-2.5 rounded-xl border ${
              isDark ? 'bg-indigo-900/30 border-indigo-700/60' : 'bg-indigo-50 border-indigo-200'
            }`}>
              <ShieldCheck className={`h-5 w-5 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                isDark ? "from-indigo-400 via-blue-400 to-cyan-400" : "from-indigo-600 via-blue-600 to-cyan-600"
              } bg-clip-text text-transparent`}>
                User Management
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and monitor all registered users - Total: {totalUsers}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </button>

            <button
              onClick={handleExport}
              disabled={users.length === 0}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                isDark
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700/40'
              } ${users.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <UserStatsCards />

      {/* Filters */}
      <UserFilters />

      {/* Users Table */}
      <UserTable users={paginatedUsers} />

      {/* Pagination */}
      {totalUsers > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          showFirstLast={true}
        />
      )}
    </div>
  );
}

