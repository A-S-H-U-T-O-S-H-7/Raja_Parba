// components/admin/raja-activity/PerformersTab.jsx
"use client";
import { useEffect } from 'react';
import { 
  Mic, 
  Users, 
  UserCircle2,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useRajaActivityStore from '@/lib/stores/useRajaActivityStore';
import { format } from 'date-fns';

export default function PerformersTab() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { performers, loading, fetchPerformers, deleteItem, setSelectedItem } = useRajaActivityStore();

  useEffect(() => {
    fetchPerformers();
  }, [fetchPerformers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-xs font-medium ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
          }`}>
            <tr>
              <th className="px-4 py-3 text-left">Performer</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Performance</th>
              <th className="px-4 py-3 text-left">Participation</th>
              <th className="px-4 py-3 text-left">Applied On</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {performers.map((performer) => (
              <tr key={performer.id} className={
                isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              }>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                      <Mic className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {performer.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {performer.gender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className={`text-xs flex items-center gap-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Mail className="w-3 h-3" />
                      {performer.email}
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Phone className="w-3 h-3" />
                      {performer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {performer.performanceType}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Track: {performer.trackMusicName}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {performer.participationType === 'Group' ? (
                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        <Users className="w-3 h-3 mr-1" />
                        Group
                      </span>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {performer.groupName} ({performer.memberCount} members)
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <UserCircle2 className="w-3 h-3 mr-1" />
                      Solo
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {performer.createdAt ? format(new Date(performer.createdAt), 'dd MMM yyyy') : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(performer)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {admin?.role === 'super_admin' && (
                      <button
                        onClick={() => deleteItem('performer', performer.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {performers.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center">
                  <Mic className={`w-12 h-12 mx-auto mb-3 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No performers yet
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}