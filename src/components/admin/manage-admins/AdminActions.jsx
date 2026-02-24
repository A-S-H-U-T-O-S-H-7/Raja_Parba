// components/admin/admins/AdminActions.jsx
"use client";
import { useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useAdminManagementStore from '@/lib/stores/useAdminManagementStore';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function AdminActions({ admin }) {
  const { admin: currentAdmin } = useAdminAuthStore();
  const { selectAdmin, deleteAdmin } = useAdminManagementStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Don't show actions for current admin (can't edit/delete yourself)
  if (admin.id === currentAdmin?.id) {
    return (
      <span className="text-xs text-gray-400 italic">Current</span>
    );
  }

  const handleEdit = () => {
    selectAdmin(admin);
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deleteAdmin(admin.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            ></div>
            
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        adminName={admin.name}
      />
    </>
  );
}