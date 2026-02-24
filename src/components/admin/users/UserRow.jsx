// components/admin/users/UserRow.jsx
"use client";
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar,
  Smartphone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import UserStatusBadge from './UserStatusBadge';
import UserActions from './UserActions';
import { format } from 'date-fns';

export default function UserRow({ user, index, onAction }) {
  const { theme } = useThemeStore();
  const [expanded, setExpanded] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (id) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <>
      {/* Main Row */}
      <tr className={`transition-colors ${
        theme === "dark" 
          ? 'hover:bg-gray-700/50 border-gray-700' 
          : 'hover:bg-gray-50 border-gray-200'
      } ${index % 2 === 0 ? (theme === "dark" ? 'bg-gray-800/50' : 'bg-white') : ''}`}>
        
        {/* Expand/Collapse for mobile */}
        <td className="lg:hidden px-4 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 rounded-lg ${
              theme === "dark" ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>

        {/* User Info with Avatar */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xs font-bold`}>
              {getInitials(user.displayName || user.email)}
            </div>
            <div>
              <div className={`text-sm font-medium ${theme === "dark" ? 'text-white' : 'text-gray-900'}`}>
                {user.displayName || 'No name'}
              </div>
              <div className={`text-xs flex items-center gap-1 mt-0.5 ${
                theme === "dark" ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
            </div>
          </div>
        </td>

        {/* Status - Hidden on mobile, shown in expanded view */}
        <td className="hidden lg:table-cell px-4 py-3">
          <UserStatusBadge status={user.status} />
        </td>

        {/* Sign-in Method */}
        <td className="hidden lg:table-cell px-4 py-3">
          <div className="flex items-center gap-1.5">
            {user.signInMethod === 'google' ? (
              <>
                <Smartphone className="w-4 h-4 text-orange-500" />
                <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
                  Google
                </span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email
                </span>
              </>
            )}
          </div>
        </td>

        {/* Joined Date */}
        <td className="hidden lg:table-cell px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
              {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <UserActions user={user} onAction={onAction} />
        </td>
      </tr>

      {/* Expanded Mobile View */}
      {expanded && (
        <tr className={`lg:hidden ${theme === "dark" ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <td colSpan="5" className="px-4 py-3">
            <div className="space-y-3">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}`}>Status:</span>
                <UserStatusBadge status={user.status} />
              </div>

              {/* Sign-in Method */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}`}>Sign-in Method:</span>
                <div className="flex items-center gap-1.5">
                  {user.signInMethod === 'google' ? (
                    <>
                      <Smartphone className="w-4 h-4 text-orange-500" />
                      <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>Google</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>Email</span>
                    </>
                  )}
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}`}>Joined:</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Phone if available */}
              {user.phone && (
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${theme === "dark" ? 'text-gray-400' : 'text-gray-500'}`}>Phone:</span>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-600'}`}>
                      {user.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}