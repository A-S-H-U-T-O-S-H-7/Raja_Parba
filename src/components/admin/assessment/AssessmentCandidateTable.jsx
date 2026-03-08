"use client";

const getStatusClass = (value = "", isDarkMode = false) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "confirmed" || normalized === "approved") {
    return isDarkMode
      ? "border-emerald-700 bg-emerald-900/40 text-emerald-200"
      : "border-emerald-200 bg-emerald-100 text-emerald-700";
  }
  if (normalized === "pending" || normalized === "requested") {
    return isDarkMode
      ? "border-amber-700 bg-amber-900/40 text-amber-200"
      : "border-amber-200 bg-amber-100 text-amber-700";
  }
  if (normalized === "completed") {
    return isDarkMode
      ? "border-emerald-700 bg-emerald-900/40 text-emerald-200"
      : "border-emerald-200 bg-emerald-100 text-emerald-700";
  }
  if (normalized === "locked" || normalized === "abandoned" || normalized === "rejected" || normalized === "cancelled") {
    return isDarkMode
      ? "border-rose-700 bg-rose-900/40 text-rose-200"
      : "border-red-200 bg-red-100 text-red-700";
  }
  if (normalized === "enabled" || normalized === "in_progress")
    return isDarkMode
      ? "border-blue-700 bg-blue-900/40 text-blue-200"
      : "border-blue-200 bg-blue-100 text-blue-700";
  return isDarkMode
    ? "border-gray-600 bg-gray-800 text-gray-200"
    : "border-gray-200 bg-gray-100 text-gray-700";
};

const getApplicationStatus = (item = {}) =>
  String(item.status || item.reviewStatus || "pending").toLowerCase();

export default function AssessmentCandidateTable({ rows = [], isDarkMode = false, onViewDetails }) {
  return (
    <div className={`overflow-hidden rounded-2xl border ${
      isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
    }`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className={isDarkMode ? "bg-gradient-to-r from-indigo-950 to-blue-950" : "bg-gradient-to-r from-indigo-50 to-blue-50"}>
            <tr className={`text-left text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? "text-blue-100" : "text-indigo-900"
            }`}>
              <th className="px-4 py-3">SN No</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Application ID</th>
              <th className="px-4 py-3">App Status</th>
              <th className="px-4 py-3">Assessment</th>
              <th className="px-4 py-3">Current Step</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className={isDarkMode ? "divide-y divide-gray-700" : "divide-y divide-gray-200"}>
            {rows.map((item, index) => {
              const appStatus = getApplicationStatus(item);
              const session = item.assessmentSession || null;
              const assessmentStatus = session?.assessmentStatus || "not_enabled";
              return (
                <tr key={item.id} className={isDarkMode ? "hover:bg-gray-800/70" : "hover:bg-gray-50"}>
                  <td className={`px-4 py-3 text-xs font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{item.name || "N/A"}</p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{item.email || "No email"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md border px-2 py-1 font-mono text-xs font-semibold ${
                      isDarkMode
                        ? "border-indigo-700 bg-indigo-900/40 text-indigo-200"
                        : "border-indigo-200 bg-indigo-50 text-indigo-700"
                    }`}>
                      {item.registrationId || item.bookingId || item.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(appStatus, isDarkMode)}`}>
                      {appStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(assessmentStatus, isDarkMode)}`}>
                      {assessmentStatus}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {session?.currentStepId || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetails?.(item)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                        isDarkMode
                          ? "bg-indigo-900/40 text-indigo-200 border border-indigo-700 hover:bg-indigo-900/60"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`px-4 py-8 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No candidates found for this track.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
