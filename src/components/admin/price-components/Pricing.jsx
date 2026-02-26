// app/admin/settings/pricing/page.jsx
"use client";
import { useEffect } from 'react';
import { Store, Tv, Save, RefreshCw } from 'lucide-react';
import usePriceStore from '@/lib/stores/usePriceStore';
import PermissionGate from '../PermissionGate';
import SyncStatus from './SyncStatus';
import StallPriceSection from './StallPriceSection';
import ShowPriceSection from './ShowPriceSection';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function PricingPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { 
    loading, 
    saving, 
    activeTab, 
    setActiveTab,
    fetchPriceSettings,
    saveSettings,
    cleanup
  } = usePriceStore();

  useEffect(() => {
    fetchPriceSettings();
    return () => cleanup();
  }, [fetchPriceSettings, cleanup]);

  const TabButton = ({ id, label, icon: Icon, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : theme === 'dark'
            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <PermissionGate permission="manage_pricing">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Price Management
            </h1>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Configure pricing for stalls and shows
            </p>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Logged in as: {admin?.name} ({admin?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SyncStatus />
            <button
              onClick={saveSettings}
              disabled={saving}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-2 p-1 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-100 border-gray-200'
        }`}>
          <TabButton
            id="stall"
            label="Stall Pricing"
            icon={Store}
            isActive={activeTab === 'stall'}
          />
          <TabButton
            id="show"
            label="Show Pricing"
            icon={Tv}
            isActive={activeTab === 'show'}
          />
        </div>

        {/* Tab Content */}
        <div className={`rounded-xl border shadow-xl ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 sm:p-6">
            {activeTab === 'stall' && <StallPriceSection />}
            {activeTab === 'show' && <ShowPriceSection />}
          </div>
        </div>
      </div>
    </PermissionGate>
  );
}