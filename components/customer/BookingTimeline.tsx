"use client";

import { Check, Sparkles } from "lucide-react";

const stages = [
  "Booked",
  "Confirmed",
  "Pickup",
  "Active Rental",
  "Return",
  "Completed",
];

export function BookingTimeline({ current = 1 }: { current?: number }) {
  const currentStage = stages[current] || stages[0];
  const progressPercent = Math.min(
    100,
    Math.max(0, (current / (stages.length - 1)) * 100)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-sand-200/90 bg-sand-50 p-4 sm:p-6 shadow-soft">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand-200/60 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Trip Status</span>
          </div>
          <h3 className="mt-0.5 font-display text-lg font-bold text-ink sm:text-xl">
            Your journey is taking shape
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-500/15 border border-accent-500/30 px-3 py-1 text-xs font-bold text-accent-700">
            Current: {currentStage}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative mt-6 px-2 sm:px-4">
        {/* Background track */}
        <div className="absolute left-6 right-6 top-3.5 sm:top-4 h-0.5 bg-sand-200 -z-0" />
        {/* Active progress bar */}
        <div
          className="absolute left-6 top-3.5 sm:top-4 h-0.5 bg-accent-500 transition-all duration-500 -z-0"
          style={{
            width: `calc(${progressPercent}% * (100% - 3rem) / 100)`,
          }}
        />

        {/* Steps */}
        <div className="relative z-10 flex w-full justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index < current;
            const isCurrent = index === current;

            return (
              <div
                key={stage}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-transform duration-300 ${
                    isCompleted
                      ? "border-accent-500 bg-accent-500 text-white shadow-xs"
                      : isCurrent
                      ? "border-accent-600 bg-sand-50 text-accent-600 ring-4 ring-accent-200/60 scale-110 font-extrabold"
                      : "border-sand-300 bg-sand-100 text-sand-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <span
                  className={`mt-2 hidden max-w-[70px] text-[11px] leading-tight font-medium sm:block ${
                    isCurrent
                      ? "font-bold text-ink"
                      : isCompleted
                      ? "text-sand-700"
                      : "text-sand-400"
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile current stage label */}
        <div className="mt-4 flex items-center justify-between text-xs text-sand-500 sm:hidden">
          <span>Step {current + 1} of {stages.length}</span>
          <span className="font-semibold text-accent-700">{currentStage}</span>
        </div>
      </div>
    </div>
  );
}
