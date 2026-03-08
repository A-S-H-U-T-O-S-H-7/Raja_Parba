"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Camera, Loader2, Mic, Move, ShieldCheck } from "lucide-react";

const formatTime = (value = 0) => {
  const safe = Math.max(0, Number(value || 0));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function QuizStep({
  questions = [],
  durationSec = 300,
  existingAnswers = {},
  existingStatus = "not_started",
  existingScore = null,
  isLocked = false,
  onStart,
  onSubmit,
}) {
  const alreadySubmitted = existingStatus === "submitted";
  const [started, setStarted] = useState(existingStatus === "in_progress");
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState(existingAnswers || {});
  const [remainingSec, setRemainingSec] = useState(durationSec);
  const [permissionState, setPermissionState] = useState("pending");
  const [cameraPosition, setCameraPosition] = useState({ x: 24, y: 110 });
  const [dragging, setDragging] = useState(false);

  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    if (!started) return undefined;
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (!started || remainingSec > 0 || submitting) return;
    (async () => {
      setSubmitting(true);
      try {
        await onSubmit?.(answers, "timer");
      } finally {
        setSubmitting(false);
      }
    })();
  }, [answers, onSubmit, remainingSec, started, submitting]);

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
  }, [started]);

  useEffect(() => {
    const onMove = (event) => {
      if (!dragRef.current.active) return;
      const nextX = Math.max(8, event.clientX - dragRef.current.offsetX);
      const nextY = Math.max(80, event.clientY - dragRef.current.offsetY);
      setCameraPosition({ x: nextX, y: nextY });
    };
    const onUp = () => {
      dragRef.current.active = false;
      setDragging(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const totalAnswered = useMemo(
    () => Object.keys(answers || {}).filter((k) => answers[k]).length,
    [answers]
  );

  const startCameraMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 24 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      setPermissionState("granted");
      return true;
    } catch (error) {
      setPermissionState("denied");
      return false;
    }
  };

  const handleStart = async () => {
    const allowed = await startCameraMic();
    if (!allowed) return;
    try {
      await onStart?.();
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      setStarted(true);
      setRemainingSec(durationSec);
    } catch (error) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      throw error;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit?.(answers, "manual");
    } finally {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setSubmitting(false);
    }
  };

  const startDrag = (event) => {
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    dragRef.current.active = true;
    dragRef.current.offsetX = event.clientX - (rect?.left || 0);
    dragRef.current.offsetY = event.clientY - (rect?.top || 0);
    setDragging(true);
  };

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-700">
          Quiz is locked because previous attempt was interrupted. Re-entry is not allowed.
        </p>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-700">
          Quiz already submitted successfully.
          {Number.isFinite(existingScore) ? ` Score: ${existingScore}/${questions.length}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-indigo-200 bg-white p-4 shadow-lg md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-900">Quiz Competition</h3>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Time Left: {formatTime(remainingSec)}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        15 questions. Timer is 5 minutes. Leaving in between will block re-entry.
      </p>

      {!started && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2 text-amber-800">
            <ShieldCheck className="mt-0.5 h-4 w-4" />
            <p className="text-xs font-semibold">
              Camera and mic permission is required before quiz start.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-1 text-[11px] font-medium text-amber-700">
              <Camera className="h-3 w-3" />
              Camera
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-1 text-[11px] font-medium text-amber-700">
              <Mic className="h-3 w-3" />
              Microphone
            </span>
          </div>
          {permissionState === "denied" && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Permission denied. Please allow camera/mic and retry.
            </p>
          )}
          <button
            type="button"
            onClick={handleStart}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Start Quiz
          </button>
        </div>
      )}

      {started && (
        <>
          <div className="mt-4 max-h-[52vh] space-y-3 overflow-y-auto pr-1">
            {questions.map((question, idx) => (
              <div key={question.id || idx} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
                <p className="text-sm font-semibold text-gray-800">
                  {idx + 1}. {question.question}
                </p>
                <div className="mt-2 space-y-1.5">
                  {(question.options || []).map((option) => (
                    <label
                      key={`${question.id}-${option}`}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-indigo-100 bg-white px-2.5 py-2 text-xs text-gray-700"
                    >
                      <input
                        type="radio"
                        name={String(question.id)}
                        value={option}
                        checked={answers?.[question.id] === option}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        className="accent-indigo-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-indigo-700">
              Answered: {totalAnswered}/{questions.length}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit Quiz
            </button>
          </div>

          <div
            style={{ right: `${cameraPosition.x}px`, top: `${cameraPosition.y}px` }}
            className={`fixed z-[60] w-56 overflow-hidden rounded-xl border border-indigo-300 bg-black shadow-xl ${
              dragging ? "cursor-grabbing" : ""
            }`}
          >
            <button
              type="button"
              onMouseDown={startDrag}
              className="flex w-full cursor-grab items-center justify-between bg-indigo-700 px-2 py-1 text-[11px] font-semibold text-white"
            >
              <span className="inline-flex items-center gap-1">
                <Move className="h-3 w-3" />
                Live Camera
              </span>
            </button>
            <video ref={videoRef} autoPlay muted playsInline className="h-36 w-full object-cover" />
          </div>
        </>
      )}
    </div>
  );
}
