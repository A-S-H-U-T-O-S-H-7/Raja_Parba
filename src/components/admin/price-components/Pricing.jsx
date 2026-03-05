// app/admin/settings/pricing/page.jsx
"use client";
import { useEffect } from 'react';
import { ArrowLeft, Store, Tv, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import usePriceStore from '@/lib/stores/usePriceStore';
import PermissionGate from '../PermissionGate';
import SyncStatus from './SyncStatus';
import StallPriceSection from './StallPriceSection';
import ShowPriceSection from './ShowPriceSection';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import useThemeStore from '@/lib/stores/useThemeStore';

export default function PricingPage() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const isDark = isDarkMode;
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
          ? 'bg-indigo-600 text-white shadow-lg'
          : isDark
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
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
      </div>
    );
  }

  return (
    <PermissionGate permission="manage_pricing">
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
              <div>
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                  isDark ? "from-indigo-400 via-blue-400 to-cyan-400" : "from-indigo-600 via-blue-600 to-cyan-600"
                } bg-clip-text text-transparent`}>
                  Price Management
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Configure pricing for stalls and shows
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Logged in as: {admin?.name} ({admin?.role})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SyncStatus />
              <button
                onClick={saveSettings}
                disabled={saving}
                className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium disabled:opacity-50 transition-all shadow-lg ${
                  isDark
                    ? 'bg-indigo-700 text-white border border-indigo-500/60 hover:bg-indigo-600'
                    : 'bg-indigo-600 text-white border border-indigo-700/40 hover:bg-indigo-700'
                }`}
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-2 p-1 rounded-xl border ${
          isDark
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
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
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
