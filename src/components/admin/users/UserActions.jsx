// components/admin/users/UserActions.jsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Edit, 
  MoreVertical,
  Ban,
  UserCheck,
  UserX,
  Trash2
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useUserStore from '@/lib/stores/useUserStore';

export default function UserActions({ user, onAction }) {
  const { theme } = useThemeStore();
  const { updateUserStatus, deleteUser } = useUserStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleAction = async (action) => {
    setShowDropdown(false);
    
    if (action === 'delete') {
      setActionType('delete');
      setShowConfirmModal(true);
      return;
    }

    if (action === 'suspend' && user.status === 'active') {
      setActionType('suspend');
      setShowConfirmModal(true);
      return;
    }

    if (action === 'activate' && user.status === 'suspended') {
      setActionType('activate');
      setShowConfirmModal(true);
      return;
    }

    if (action === 'ban') {
      setActionType('ban');
      setShowConfirmModal(true);
      return;
    }

    // Direct actions
    if (action === 'view' && onAction) {
      onAction('view', user);
    }
  };

  const confirmAction = async () => {
    setShowConfirmModal(false);
    
    try {
      switch(actionType) {
        case 'suspend':
          await updateUserStatus(user.id, 'suspended');
          break;
        case 'activate':
          await updateUserStatus(user.id, 'active');
          break;
        case 'ban':
          await updateUserStatus(user.id, 'banned');
          break;
        case 'delete':
          await deleteUser(user.id);
          break;
      }
      
      if (onAction) {
        onAction(actionType, user);
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionType(null);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/users/${user.id}`}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <Link
            href={`/admin/users/${user.id}/edit`}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </Link>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                ></div>
                
                <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-50 border ${
                  theme === "dark" 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="py-1">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleAction('suspend')}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                          theme === "dark" 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <UserX className="w-4 h-4 text-yellow-500" />
                        Suspend User
                      </button>
                    ) : user.status === 'suspended' ? (
                      <button
                        onClick={() => handleAction('activate')}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                          theme === "dark" 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-green-500" />
                        Activate User
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleAction('ban')}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        theme === "dark" 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Ban className="w-4 h-4 text-red-500" />
                      Ban User
                    </button>

                    <div className={`border-t my-1 ${
                      theme === "dark" ? 'border-gray-700' : 'border-gray-200'
                    }`}></div>

                    <button
                      onClick={() => handleAction('delete')}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                        theme === "dark" 
                          ? 'text-red-400 hover:bg-gray-700' 
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirmModal(false)}></div>
          
          <div className={`relative rounded-xl shadow-xl max-w-md w-full p-6 ${
            theme === "dark" ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              theme === "dark" ? 'text-white' : 'text-gray-900'
            }`}>
              Confirm {actionType}
            </h3>
            
            <p className={`mb-6 ${
              theme === "dark" ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {actionType === 'delete' && 'Are you sure you want to delete this user? This action cannot be undone.'}
              {actionType === 'suspend' && 'Are you sure you want to suspend this user? They will not be able to log in.'}
              {actionType === 'activate' && 'Are you sure you want to activate this user?'}
              {actionType === 'ban' && 'Are you sure you want to ban this user? This is more severe than suspension.'}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === "dark" 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                  actionType === 'delete' || actionType === 'ban'
                    ? 'bg-red-600 hover:bg-red-700'
                    : actionType === 'suspend'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}