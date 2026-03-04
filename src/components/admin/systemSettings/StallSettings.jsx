"use client";
import {
  Calendar,
  Settings,
  Store,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import useThemeStore from "@/lib/stores/useThemeStore";
import useSystemSettingsStore from "@/lib/stores/useSystemSettingsStore";

export default function StallSettings() {
  const { isDarkMode } = useThemeStore();
  const {
    stallSettings,
    dateValidationErrors,
    updateStallTotal,
    updateStallEventDates,
    toggleStallEventDates,
    toggleStallActive,
    removeStall,
    addIndividualStall,
    generateAllStalls,
  } = useSystemSettingsStore();

  const [showAllStalls, setShowAllStalls] = useState(false);
  const activeStalls = stallSettings.stalls.filter((s) => s.isActive);

  return (
    <div className="space-y-8 p-6">
      <div className={`rounded-lg border p-6 ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          <Settings className="w-5 h-5 mr-2" />
          Stall Configuration
        </h3>

        <div className={`mb-6 p-4 rounded-md ${isDarkMode ? "bg-gray-600" : "bg-white"}`}>
          <h4 className={`text-sm font-medium mb-3 flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Settings className="w-4 h-4 mr-2" />
            Global Configuration
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Total Stalls</label>
              <input
                type="number"
                min="1"
                max="200"
                value={stallSettings.totalStalls}
                onChange={(e) => updateStallTotal(parseInt(e.target.value, 10) || 70)}
                className={`block w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 ${isDarkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</label>
              <button
                onClick={generateAllStalls}
                className="w-full inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate All Stalls
              </button>
            </div>
          </div>

          <div className={`p-3 rounded-md ${isDarkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
              This generates stalls S1 through S{stallSettings.totalStalls}. Pricing is handled in Price Settings.
            </p>
          </div>
        </div>

        <div className={`mb-6 p-4 rounded-md ${isDarkMode ? "bg-gray-600" : "bg-white"}`}>
          <h4 className={`text-sm font-medium mb-3 flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Calendar className="w-4 h-4 mr-2" />
            Stall Event Dates
          </h4>

          <div className="flex items-center mb-3">
            <input
              id="stallDatesActive"
              type="checkbox"
              checked={stallSettings.eventDates.isActive}
              onChange={(e) => toggleStallEventDates(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="stallDatesActive" className={`ml-2 block text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Enable custom stall booking dates
            </label>
          </div>

          {stallSettings.eventDates.isActive && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Start Date</label>
                <input
                  type="date"
                  value={stallSettings.eventDates.startDate}
                  onChange={(e) => updateStallEventDates("startDate", e.target.value)}
                  className={`block w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 ${isDarkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>End Date</label>
                <input
                  type="date"
                  value={stallSettings.eventDates.endDate}
                  onChange={(e) => updateStallEventDates("endDate", e.target.value)}
                  className={`block w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500 ${isDarkMode ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
            </div>
          )}

          {(dateValidationErrors.startDate || dateValidationErrors.endDate) && (
            <div className={`mt-3 p-3 rounded-md ${isDarkMode ? "bg-red-900/30 border border-red-700" : "bg-red-50 border border-red-200"}`}>
              {dateValidationErrors.startDate && (
                <p className={`text-sm flex items-center ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Start Date: {dateValidationErrors.startDate}
                </p>
              )}
              {dateValidationErrors.endDate && (
                <p className={`text-sm flex items-center ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  End Date: {dateValidationErrors.endDate}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAllStalls(!showAllStalls)}
            className="flex items-center justify-between w-full p-3 bg-gray-100 dark:bg-gray-600 rounded-md mb-3"
          >
            <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Current Stalls ({stallSettings.stalls.length})
            </h4>
            {showAllStalls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAllStalls && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {stallSettings.stalls.map((stall, index) => (
                <div
                  key={stall.id}
                  className={`flex items-center space-x-3 p-3 rounded-md border ${isDarkMode ? "bg-gray-600 border-gray-500" : "bg-white border-gray-200"} ${!stall.isActive ? "opacity-60" : ""}`}
                >
                  <button
                    onClick={() => toggleStallActive(index)}
                    className={`p-1 rounded ${stall.isActive ? "text-green-600 hover:bg-green-100" : "text-gray-400 hover:bg-gray-200"}`}
                  >
                    {stall.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <Store className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stall.name}</div>
                    <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{stall.size}</div>
                  </div>
                  <button
                    onClick={() => removeStall(index)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Remove stall"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`border-t pt-4 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
          <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Add Individual Stall</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Stall ID (Auto)</label>
              <input
                type="text"
                value={`S${stallSettings.stalls.length + 1}`}
                readOnly
                className={`px-3 py-2 text-sm rounded-md border cursor-not-allowed w-full ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-600"}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Stall Name (Auto)</label>
              <input
                type="text"
                value={`Stall S${stallSettings.stalls.length + 1}`}
                readOnly
                className={`px-3 py-2 text-sm rounded-md border cursor-not-allowed w-full ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-600"}`}
              />
            </div>
          </div>
          <button
            onClick={() => addIndividualStall()}
            className="mt-3 w-full inline-flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Next Stall (S{stallSettings.stalls.length + 1})
          </button>
        </div>

        <div className={`mt-6 p-4 rounded-md border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
          <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Stall Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-green-900/30 border border-green-700" : "bg-green-50 border border-green-200"}`}>
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{activeStalls.length}</div>
              <div className={`text-sm font-medium ${isDarkMode ? "text-green-300" : "text-green-700"}`}>Active Stalls</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-200"}`}>
              <div className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{stallSettings.stalls.length}</div>
              <div className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>Total Stalls</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-purple-900/30 border border-purple-700" : "bg-purple-50 border border-purple-200"}`}>
              <div className={`text-sm font-semibold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>Pricing is managed in Price Settings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
