"use client";

import { useMemo, useState } from "react";
import {
  Brush,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Info,
  Mic,
  Video,
} from "lucide-react";

const iconByStep = (step = {}) => {
  const value = `${step.id} ${step.title}`.toLowerCase();
  if (value.includes("rangoli")) return Brush;
  if (value.includes("quiz")) return Mic;
  if (value.includes("dress") || value.includes("attire")) return CreditCard;
  if (value.includes("self")) return Video;
  return FileText;
};

const emojiByStep = (step = {}) => {
  const value = `${step.id} ${step.title}`.toLowerCase();
  if (value.includes("rangoli")) return "\u{1F338}";
  if (value.includes("quiz")) return "\u{1F9E0}";
  if (value.includes("dress") || value.includes("attire")) return "\u{1F457}";
  if (value.includes("self")) return "\u{1F3A4}";
  if (value.includes("zoom")) return "\u{1F3A5}";
  return "\u2728";
};

export default function AssessmentStepNav({
  steps = [],
  stepStates = {},
  activeStepId,
  onSelectStep,
  canNavigateToStep,
  quizScore = null,
  quizTotal = 15,
  isLocked = false,
}) {
  const [infoStepId, setInfoStepId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentStepIndex = useMemo(() => {
    const index = steps.findIndex((s) => s.id === activeStepId);
    return index >= 0 ? index : 0;
  }, [activeStepId, steps]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg">
      <h2 className="text-center text-base font-bold text-slate-800 md:text-lg">Assessment Steps</h2>

      <div className="mt-3 hidden lg:block">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/60 p-2 shadow-sm">
            {steps.map((step, index) => {
              const Icon = iconByStep(step);
              const state = stepStates?.[step.id]?.status || "pending";
              const isCompleted = state === "completed";
              const isActive = activeStepId === step.id;
              const isLast = index === steps.length - 1;
              const isDisabled = isLocked || !canNavigateToStep?.(step.id);

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onSelectStep?.(step.id)}
                    className="flex items-center space-x-2 rounded-lg px-2 py-1.5 transition-all duration-300 hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ${
                      isCompleted
                        ? "bg-gradient-to-br from-emerald-600 via-teal-400 to-teal-700 text-white"
                        : isActive
                          ? "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                          : "border border-gray-300/50 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500"
                    }`}>
                      {isCompleted ? <Check className="h-6 w-6 " /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${isCompleted ? "text-emerald-800" : isActive ? "font-semibold text-slate-800" : "text-slate-700"}`}>
                        {step.title} {emojiByStep(step)}
                      </p>
                      {step.id === "quiz" && Number.isFinite(quizScore) ? (
                        <p className="text-[10px] font-semibold text-teal-700">{quizScore}/{quizTotal}</p>
                      ) : null}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInfoStepId((prev) => (prev === step.id ? null : step.id))}
                    className="shake-i ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700"
                    aria-label={`Step info ${step.title}`}
                  >
                    <Info className="h-3 w-3" />
                  </button>

                  {!isLast && <div className={`mx-2 h-0.5 w-6 rounded-full ${isCompleted ? "bg-gradient-to-r from-emerald-600 to-teal-700" : "bg-gray-300"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 hidden md:block lg:hidden">
        <div className="mx-auto max-w-lg rounded-xl border border-blue-200/40 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-800">{steps[currentStepIndex]?.title} {emojiByStep(steps[currentStepIndex])}</h3>
              <p className="text-xs text-slate-700">Step {currentStepIndex + 1} of {steps.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setInfoStepId((prev) => (prev === steps[currentStepIndex]?.id ? null : steps[currentStepIndex]?.id))}
              className="shake-i inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 transition-all duration-700" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-3 md:hidden">
        <div className="rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 shadow-md">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMobileOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMobileOpen((prev) => !prev);
              }
            }}
            className="flex w-full cursor-pointer items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{steps[currentStepIndex]?.title} {emojiByStep(steps[currentStepIndex])}</h3>
              <p className="text-xs text-slate-700">Step {currentStepIndex + 1} of {steps.length}</p>
            </div>
            <span className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoStepId((prev) => (prev === steps[currentStepIndex]?.id ? null : steps[currentStepIndex]?.id));
                }}
                className="shake-i inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
              >
                <Info className="h-4 w-4" />
              </button>
              {mobileOpen ? <ChevronUp className="h-4 w-4 text-blue-700" /> : <ChevronDown className="h-4 w-4 text-blue-700" />}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 transition-all duration-700" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
          </div>
          {mobileOpen ? (
            <div className="mt-3 space-y-2">
              {steps.map((step, index) => {
                const Icon = iconByStep(step);
                const state = stepStates?.[step.id]?.status || "pending";
                const isCompleted = state === "completed";
                const isActive = activeStepId === step.id;
                const isDisabled = isLocked || !canNavigateToStep?.(step.id);
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectStep?.(step.id)}
                      disabled={isDisabled}
                      className={`flex-1 rounded-lg border px-2 py-2 text-left text-xs ${isActive ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"} ${isDisabled ? "opacity-60" : ""}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${isCompleted ? "bg-linear-to-br from-emerald-600 via-emerald-400 to-teal-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                        </span>
                        <span className="font-medium text-slate-800">{step.title} {emojiByStep(step)}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInfoStepId((prev) => (prev === step.id ? null : step.id))}
                      className="shake-i inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {infoStepId ? (
        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-center text-xs font-medium text-blue-800">
          {steps.find((s) => s.id === infoStepId)?.description}
        </div>
      ) : null}

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-1px);
          }
          75% {
            transform: translateX(1px);
          }
        }
        .shake-i {
          animation: shake 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
