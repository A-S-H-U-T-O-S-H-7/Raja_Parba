// app/admin/admins/page.jsx
"use client";
import { useState } from 'react';
import { Shield, Plus, RefreshCw } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useAdminManagementStore from '@/lib/stores/useAdminManagementStore';
import AdminTable from './AdminTable';
import AddAdminModal from './AddAdminModal';
import EditAdminModal from './EditAdminModal';
import PermissionGate from '../PermissionGate';

export default function AdminsPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { fetchAdmins, selectedAdmin } = useAdminManagementStore();
  
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRefresh = () => {
    fetchAdmins();
  };

  return (
    <PermissionGate permission="manage_admins">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? 'text-white' : 'text-gray-900'}`}>
              Admin Management
            </h1>
            <p className={`text-sm mt-1 ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage admin users and their permissions
            </p>
            <p className={`text-xs mt-1 ${theme === "dark" ? 'text-gray-500' : 'text-gray-400'}`}>
              Logged in as: {admin?.name} ({admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                theme === "dark" 
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Admin
            </button>
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