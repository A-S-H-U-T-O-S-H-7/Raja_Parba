"use client";

import { CheckCircle2, Circle, Lock, Sparkles } from "lucide-react";

export default function AssessmentStepNav({
  steps = [],
  stepStates = {},
  activeStepId,
  onSelectStep,
  canAccessStep,
  quizScore = null,
  quizTotal = 15,
  isLocked = false,
}) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
      <h2 className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-900">
        <Sparkles className="h-4 w-4" />
        Assessment Steps
      </h2>
      <div className="space-y-2">
        {steps.map((step, index) => {
          const state = stepStates?.[step.id]?.status || "pending";
          const isCompleted = state === "completed";
          const isActive = activeStepId === step.id;
          const isAccessible = canAccessStep?.(step.id, index) ?? true;
          const isDisabled = isLocked || !isAccessible;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep?.(step.id)}
              disabled={isDisabled}
              className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                isCompleted
                  ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100"
                  : isActive
                    ? "border-teal-300 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/40"
              } ${isDisabled ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {isDisabled ? (
                    <Lock className="h-4 w-4 text-gray-400" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800">
                    Step {index + 1}: {step.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{step.description}</p>
                  {step.id === "quiz" && Number.isFinite(quizScore) ? (
                    <p className="mt-1 text-[11px] font-semibold text-teal-700">
                      Quiz Score: {quizScore}/{quizTotal}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
