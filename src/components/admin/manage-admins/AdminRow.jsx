// components/admin/admins/AdminRow.jsx
"use client";
import { useState } from 'react';
import { Mail, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import AdminRoleBadge from './AdminRoleBadge';
import AdminPermissionBadge from './AdminPermissionBadge';
import AdminActions from './AdminActions';
import { format } from 'date-fns';

export default function AdminRow({ admin, index }) {
  const { isDarkMode } = useThemeStore();
  const [expanded, setExpanded] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id) => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <>
      {/* Main Row */}
      <tr className={`transition-colors ${
        isDarkMode 
          ? 'hover:bg-gray-700/50 border-gray-700' 
          : 'hover:bg-gray-50 border-gray-200'
      } ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800/50' : 'bg-white') : ''}`}>
        
        {/* Expand for mobile */}
        <td className="lg:hidden px-4 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>

        {/* Admin Info with Avatar */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${getAvatarColor(admin.id)} flex items-center justify-center text-white text-xs font-bold`}>
              {getInitials(admin.name)}
            </div>
            <div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {admin.name}
              </div>
              <div className={`text-xs flex items-center gap-1 mt-0.5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Mail className="w-3 h-3" />
                {admin.email}
              </div>
            </div>
          </div>
        </td>

        {/* Username */}
        <td className="hidden lg:table-cell px-4 py-3">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {admin.username}
          </span>
        </td>

        {/* Role */}
        <td className="hidden lg:table-cell px-4 py-3">
          <AdminRoleBadge role={admin.role} />
        </td>

        {/* Permissions Count */}
        <td className="hidden lg:table-cell px-4 py-3">
          {admin.role === 'super_admin' ? (
            <span className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              All Permissions
            </span>
          ) : (
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {admin.permissions?.length || 0} permissions
            </span>
          )}
        </td>

        {/* Last Login */}
        <td className="hidden lg:table-cell px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {admin.lastLogin ? format(new Date(admin.lastLogin), 'MMM dd, yyyy') : 'Never'}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <AdminActions admin={admin} />
        </td>
      </tr>

      {/* Expanded Mobile View */}
      {expanded && (
        <tr className={`lg:hidden ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <td colSpan="2" className="px-4 py-3">
            <div className="space-y-3">
              {/* Username */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Username:</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {admin.username}
                </span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Role:</span>
                <AdminRoleBadge role={admin.role} />
              </div>

              {/* Permissions */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Permissions:</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {admin.role === 'super_admin' ? 'All' : `${admin.permissions?.length || 0} permissions`}
                </span>
              </div>

              {/* Last Login */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Login:</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {admin.lastLogin ? format(new Date(admin.lastLogin), 'MMM dd, yyyy') : 'Never'}
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Created:</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {admin.createdAt ? format(new Date(admin.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}