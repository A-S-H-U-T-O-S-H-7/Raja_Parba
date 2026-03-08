"use client";

import { CalendarClock, Info, Video } from "lucide-react";

export default function ZoomMeetingStep({
  title,
  description,
  existingData,
  disabled = false,
}) {
  const hasSchedule = Boolean(existingData?.zoomLink && existingData?.slot);

  return (
    <div className="rounded-3xl border border-violet-200 bg-white/95 p-4 shadow-lg md:p-6">
      <h3 className="text-xl font-semibold text-violet-900">{title}</h3>
      <p className="mt-1 text-sm text-violet-700/90">{description}</p>

      {hasSchedule ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-violet-800">
            <CalendarClock className="h-4 w-4" />
            {existingData.slot}
          </p>
          <a
            href={existingData.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <Video className="h-4 w-4" />
            Join Zoom Meeting
          </a>
          <p className="text-xs text-violet-700">
            {existingData.note || "Please join 5 minutes early with camera and microphone ready."}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          <p className="inline-flex items-center gap-1">
            <Info className="h-4 w-4" />
            Meeting will be scheduled very soon...
          </p>
          <p className="mt-1 text-xs font-medium text-amber-700">
            Admin will set the Zoom link, timing and notes after your previous steps are verified.
          </p>
        </div>
      )}
      {disabled ? <p className="mt-2 text-xs text-violet-700">Assessment is currently locked.</p> : null}
    </div>
  );
}
