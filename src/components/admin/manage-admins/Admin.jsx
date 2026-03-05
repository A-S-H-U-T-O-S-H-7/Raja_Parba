// app/admin/admins/page.jsx
"use client";
import { useState } from 'react';
import { ArrowLeft, Shield, Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useAdminManagementStore from '@/lib/stores/useAdminManagementStore';
import AdminTable from './AdminTable';
import AddAdminModal from './AddAdminModal';
import EditAdminModal from './EditAdminModal';
import PermissionGate from '../PermissionGate';

export default function AdminsPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const isDark = isDarkMode;
  const { admin } = useAdminAuthStore();
  const { fetchAdmins, selectedAdmin } = useAdminManagementStore();
  
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRefresh = () => {
    fetchAdmins();
  };

  return (
    <PermissionGate permission="manage_admins">
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
                isDark ? 'bg-violet-900/30 border-violet-700/60' : 'bg-violet-50 border-violet-200'
              }`}>
                <Shield className={`h-5 w-5 ${isDark ? 'text-violet-300' : 'text-violet-600'}`} />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-violet-400 via-indigo-400 to-blue-400" : "from-violet-600 via-indigo-600 to-blue-600"
                } bg-clip-text text-transparent`}>
                  Admin Management
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage admin users and their permissions
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Logged in as: {admin?.name} ({admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  isDark
                    ? 'bg-violet-700 text-white border border-violet-500/60 hover:bg-violet-600'
                    : 'bg-violet-600 text-white border border-violet-700/40 hover:bg-violet-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Admin
              </button>
            </div>
          </div>
        </div>

        {/* Admin Table */}
        <AdminTable />

        {/* Modals */}
        <AddAdminModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleRefresh}
        />

        <EditAdminModal
          isOpen={!!selectedAdmin}
          onClose={() => {}} 
          onSuccess={handleRefresh}
        />
      </div>
    </PermissionGate>
  );
}
