// app/admin/raja-activity/page.jsx
"use client";
import { useState } from 'react';
import { 
  Mic, 
  Heart, 
  Award, 
  Crown, 
  Sparkles,
  Plus,
  RefreshCw,
  History
} from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import PermissionGate from '../PermissionGate';

// Import tab components (we'll create these next)
import SponsorsTab from './SponsorsTab';
import PerformersTab from './PerformersTab';
import AwardNomineesTab from './AwardNomineesTab';
import RajaKumariTab from './RajaKumariTab';
import FancyDressTab from './FancyDressTab';

// Import modals
import SponsorModal from '@/components/sponsor-perfomer/SponsorModal';
import PerformerModal from '@/components/sponsor-perfomer/PerformerModal';

export default function RajaActivityPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const [activeTab, setActiveTab] = useState('sponsors');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPerformerModal, setShowPerformerModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: 'sponsors', name: 'Sponsors', icon: Heart, color: 'amber', modal: 'sponsor' },
    { id: 'performers', name: 'Performers', icon: Mic, color: 'cyan', modal: 'performer' },
    { id: 'award-nominees', name: 'Award Nominee', icon: Award, color: 'purple', modal: 'award' },
    { id: 'raja-kumari', name: 'Raja Kumari', icon: Crown, color: 'pink', modal: 'kumari' },
    { id: 'fancy-dress', name: 'Fancy Dress', icon: Sparkles, color: 'green', modal: 'fancy' }
  ];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAddClick = () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab?.modal === 'sponsor') {
      setShowAddModal(true);
    } else if (currentTab?.modal === 'performer') {
      setShowPerformerModal(true);
    } else {
      // For other tabs, we'll create their modals later
      alert(`Add functionality for ${currentTab?.name} coming soon!`);
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'sponsors':
        return <SponsorsTab key={refreshKey} />;
      case 'performers':
        return <PerformersTab key={refreshKey} />;
      case 'award-nominees':
        return <AwardNomineesTab key={refreshKey} />;
      case 'raja-kumari':
        return <RajaKumariTab key={refreshKey} />;
      case 'fancy-dress':
        return <FancyDressTab key={refreshKey} />;
      default:
        return null;
    }
  };

  return (
    <PermissionGate permission="view_sponsor_performer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${theme === "dark" ? 'text-white' : 'text-gray-900'}`}>
              Raja Activity
            </h1>
            <p className={`text-sm mt-1 ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage sponsors, performers, and special categories
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
              onClick={handleAddClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add {tabs.find(t => t.id === activeTab)?.name}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b ${theme === "dark" ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="flex overflow-x-auto space-x-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${isActive 
                      ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400` 
                      : `border-transparent ${theme === "dark" ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? `text-${tab.color}-500` : ''}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* Modals */}
        <SponsorModal
          showSponsorModal={showAddModal}
          setShowSponsorModal={setShowAddModal}
          sponsorForm={{}}
          setSponsorForm={() => {}}
          handleSponsorSubmit={() => {
            // Handle sponsor submit
            setShowAddModal(false);
            handleRefresh();
          }}
        />

        <PerformerModal
          showPerformerModal={showPerformerModal}
          setShowPerformerModal={setShowPerformerModal}
          performerForm={{}}
          setPerformerForm={() => {}}
          handlePerformerSubmit={() => {
            // Handle performer submit
            setShowPerformerModal(false);
            handleRefresh();
          }}
        />
      </div>
    </PermissionGate>
  );
}