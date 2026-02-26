// app/admin/settings/system/page.jsx
"use client";
import { useEffect } from 'react';
import { Settings, Store, Ticket, Save, CheckCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useSystemSettingsStore from '@/lib/stores/useSystemSettingsStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import PermissionGate from '@/components/admin/PermissionGate';
import TabButton from '@/components/admin/systemSettings/TabButton';
import StallSettings from '@/components/admin/systemSettings/StallSettings';
import ShowSettings from '@/components/admin/systemSettings/ShowSettings';

export default function SystemSettingsPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { 
    loading, 
    saving, 
    activeTab, 
    setActiveTab,
    initialize,
    saveSettings
  } = useSystemSettingsStore();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <PermissionGate permission="manage_settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ⚙️ System Settings
            </h1>
            <p className={`mt-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Configure stall and show settings
            </p>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Logged in as: {admin?.name} ({admin?.role})
            </p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors shadow-lg ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex flex-wrap gap-2 p-1 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-100 border-gray-200'
        }`}>
          <TabButton
            id="stall"
            label="Stall Settings"
            icon={Store}
            isActive={activeTab === 'stall'}
            onClick={setActiveTab}
          />
          <TabButton
            id="show"
            label="Show Settings"
            icon={Ticket}
            isActive={activeTab === 'show'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className={`rounded-xl border shadow-xl ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {activeTab === 'stall' && <StallSettings />}
          {activeTab === 'show' && <ShowSettings />}
        </div>
      </div>
    </PermissionGate>
  );
}