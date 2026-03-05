// components/admin/admins/AdminActions.jsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useAdminManagementStore from '@/lib/stores/useAdminManagementStore';
import DeleteConfirmModal from './DeleteConfirmModal';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function AdminActions({ admin }) {
  const { isDarkMode } = useThemeStore();
  const { admin: currentAdmin } = useAdminAuthStore();
  const { selectAdmin, deleteAdmin } = useAdminManagementStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

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

  const toggleDropdown = () => {
    if (!showDropdown && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.right - 144
      });
    }
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    if (!showDropdown) return;
    const handleResize = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.right - 144
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [showDropdown]);

  return (
    <>
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={toggleDropdown}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            ></div>
            
            <div
              className={`fixed w-36 rounded-lg shadow-xl border z-[60] ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
              style={{ top: dropdownPos.top, left: dropdownPos.left }}
            >
              <div className="py-1">
                <button
                  onClick={handleEdit}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                    isDarkMode
                      ? 'hover:bg-red-900/20 text-red-400'
                      : 'hover:bg-red-50 text-red-600'
                  }`}
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
