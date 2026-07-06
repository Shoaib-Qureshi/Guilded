"use client";

import { cn } from "@/lib/utils";

type Step = { label: string };
type Props = { steps: Step[]; currentStep: number };

function DiamondShape({ active, completed }: { active: boolean; completed: boolean }) {
  const filled = active || completed;
  return (
    <div className="relative flex size-[52px] shrink-0 items-center justify-center">
      <div
        className={cn(
          "-rotate-45 size-[36.9px] rounded-[10.65px]",
          filled ? "bg-[#a36f26]" : "bg-[#cdae82]"
        )}
      />
      <div
        className={cn(
          "-rotate-45 absolute size-[33.4px] rounded-[10.65px] border-[0.71px]",
          filled ? "border-[#cdae82]" : "border-[#ddcfbc]"
        )}
      />
    </div>
  );
}

export function StepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="relative flex w-full items-start justify-between">
      {/* connecting line — vertically centred on diamonds (26px = half of 52px) */}
      <div className="absolute top-[26px] left-[26px] right-[26px] h-px bg-[#cdae82]/60" />

      {steps.map((step, i) => {
        const n = i + 1;
        const isActive = n === currentStep;
        const isCompleted = n < currentStep;
        return (
          <div key={step.label} className="relative flex flex-col items-center gap-[10px] z-10">
            <DiamondShape active={isActive} completed={isCompleted} />
            <span
              className={cn(
                "text-center font-thin text-[13px] sm:text-[16px] tracking-[-0.06em] text-guilded-cream transition-opacity",
                isActive || isCompleted ? "opacity-100" : "opacity-0"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
