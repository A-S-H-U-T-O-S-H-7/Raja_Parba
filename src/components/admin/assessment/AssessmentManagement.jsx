"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import useThemeStore from "@/lib/stores/useThemeStore";
import AssessmentTrackPanel from "@/components/admin/assessment/AssessmentTrackPanel";
import AssessmentCandidateTable from "@/components/admin/assessment/AssessmentCandidateTable";
import AssessmentCandidateDetailModal from "@/components/admin/assessment/AssessmentCandidateDetailModal";
import {
  enableAssessmentsForConfirmedCandidates,
  getTrackCandidatesWithSessions,
} from "@/services/assessmentService";

const TRACKS = [
  { key: "rajaQueen", title: "Raja Queen", subtitle: "5-step assessment flow for confirmed candidates" },
  { key: "rajaKumari", title: "Raja Kumari", subtitle: "5-step assessment flow for confirmed candidates" },
  { key: "drawingSenior", title: "Drawing Senior", subtitle: "3-step senior drawing assessment" },
  { key: "drawingJunior", title: "Drawing Junior", subtitle: "3-step junior drawing assessment" },
];

export default function AssessmentManagement() {
  const { admin } = useAdminAuthStore();
  const { isDarkMode } = useThemeStore();
  const [activeTrack, setActiveTrack] = useState(TRACKS[0].key);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const loadTrackRows = async (trackKey) => {
    setLoading(true);
    try {
      const data = await getTrackCandidatesWithSessions(trackKey);
      setRows(data || []);
    } catch (error) {
      toast.error("Failed to load assessment candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackRows(activeTrack);
  }, [activeTrack]);

  const counts = useMemo(() => {
    const total = rows.length;
    const enabled = rows.filter((r) => Boolean(r.assessmentSession?.enabled)).length;
    const pending = total - enabled;
    return { total, enabled, pending };
  }, [rows]);

  const handleEnableAll = async () => {
    setEnabling(true);
    try {
      const result = await enableAssessmentsForConfirmedCandidates({
        assessmentType: activeTrack,
        adminId: admin?.id || null,
        adminName: admin?.name || admin?.username || "Admin",
      });
      toast.success(`Enabled for ${result?.enabledCount || 0} candidates`);
      await loadTrackRows(activeTrack);
    } catch (error) {
      toast.error(error?.message || "Enable action failed");
    } finally {
      setEnabling(false);
    }
  };

  const activeMeta = TRACKS.find((track) => track.key === activeTrack) || TRACKS[0];

  const handleCandidateUpdated = async () => {
    const refreshed = await getTrackCandidatesWithSessions(activeTrack);
    setRows(refreshed || []);
    if (selectedCandidate?.id) {
      const latest = (refreshed || []).find((row) => row.id === selectedCandidate.id) || null;
      setSelectedCandidate(latest);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 shadow-sm ${
        isDarkMode
          ? "border-indigo-700/40 bg-gradient-to-br from-indigo-950/80 via-gray-900 to-blue-950/70"
          : "border-purple-400 bg-gradient-to-br from-purple-100 via-white to-purple-200"
      }`}>
        <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Assessment Management</h1>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Enable and monitor assessment lifecycle for Raja Queen, Raja Kumari, Drawing Senior and Drawing Junior.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRACKS.map((track) => (
            <button
              key={track.key}
              type="button"
              onClick={() => setActiveTrack(track.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                activeTrack === track.key
                  ? "border-indigo-300 bg-indigo-600 text-white"
                  : isDarkMode
                    ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {track.title}
            </button>
          ))}
        </div>
      </div>

      <AssessmentTrackPanel
        title={activeMeta.title}
        subtitle={activeMeta.subtitle}
        total={counts.total}
        enabled={counts.enabled}
        pending={counts.pending}
        enabling={enabling}
        onEnableAll={handleEnableAll}
        isDarkMode={isDarkMode}
      />

      {loading ? (
        <div className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${
          isDarkMode
            ? "border-indigo-800 bg-indigo-900/30 text-indigo-200"
            : "border-indigo-200 bg-indigo-50 text-indigo-700"
        }`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading candidates...
        </div>
      ) : (
        <AssessmentCandidateTable
          rows={rows}
          isDarkMode={isDarkMode}
          onViewDetails={setSelectedCandidate}
        />
      )}

      <AssessmentCandidateDetailModal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        candidate={selectedCandidate}
        isDarkMode={isDarkMode}
        onUpdated={handleCandidateUpdated}
      />
    </div>
  );
}
