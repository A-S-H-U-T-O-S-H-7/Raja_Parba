// components/admin/price/SyncStatus.jsx
"use client";
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import useThemeStore from '@/lib/stores/useThemeStore';
import usePriceStore from '@/lib/stores/usePriceStore';

export default function SyncStatus() {
  const { isDarkMode } = useThemeStore();
  const { syncStatus, lastSync } = usePriceStore();

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return 'Real-time sync active';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Sync error';
      default:
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'connected':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'connecting':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'error':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-500';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {getStatusIcon()}
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {lastSync && syncStatus === 'connected' && (
          <span className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Last sync: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}