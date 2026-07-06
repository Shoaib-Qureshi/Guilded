"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { AgencyForm } from "@/components/onboarding/AgencyForm";
import { FinishingForm } from "@/components/onboarding/FinishingForm";
import { SuccessScreen } from "@/components/onboarding/SuccessScreen";
import type { OnboardingValues, AgencyValues, FinishingValues } from "@/lib/validations/onboarding";

const STEPS = [
  { label: "About You" },
  { label: "About your agency" },
  { label: "Finishing steps" },
];

const CARD_HEIGHTS: Record<number, number> = { 1: 581, 2: 1066, 3: 734 };

type CollectedData = Partial<OnboardingValues & AgencyValues & FinishingValues>;

export function OnboardingShell() {
  const { step, nextStep, prevStep } = useOnboardingStore();

  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [arrowFlying, setArrowFlying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function animateNext() {
    setArrowFlying(true);
    setTimeout(() => {
      nextStep();
      setArrowFlying(false);
    }, 380);
  }

  function handleStep1Complete(values: OnboardingValues) {
    setCollectedData((prev) => ({ ...prev, ...values }));
    animateNext();
  }

  function handleStep2Complete(values: AgencyValues) {
    setCollectedData((prev) => ({ ...prev, ...values }));
    animateNext();
  }

  async function handleFinalSubmit(values: FinishingValues) {
    const payload = { ...collectedData, ...values };
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex flex-1 flex-col items-center px-6">
        <div
          className="relative mt-[95px] w-full max-w-[1282px] overflow-hidden rounded-[20px] bg-guilded-green"
          style={{ height: 500 }}
        >
          <SuccessScreen />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6">
      {/* Card — height transitions smoothly between steps */}
      <div
        className="relative mt-[95px] w-full max-w-[1282px] overflow-hidden rounded-[20px] bg-guilded-green transition-[height] duration-500"
        style={{ height: CARD_HEIGHTS[step] ?? 581 }}
      >
        {/* Step indicator */}
        <div className="absolute top-[49px] left-0 right-0 px-6 sm:px-16 lg:px-[142px]">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        {/* Back arrow — visible on steps 2 and 3; remounts each step to replay slide-in */}
        {step > 1 && (
          <button
            key={`back-${step}`}
            onClick={prevStep}
            aria-label="Go back"
            className="absolute z-10 size-[44px] top-[224px] left-4 sm:left-[calc(50%-226.5px)] cursor-pointer rounded-[15px] bg-guilded-gold flex items-center justify-center p-[10px]"
            style={{ animation: "arrow-slide-in 0.3s ease-out" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/svg/arrow.svg" alt="" className="w-full h-full rotate-180" />
          </button>
        )}

        {/* Step 1 — About You */}
        {step === 1 && (
          <div className="absolute top-[192px] left-0 right-0 flex justify-center">
            <OnboardingForm onComplete={handleStep1Complete} arrowFlying={arrowFlying} />
          </div>
        )}

        {/* Step 2 — About your agency */}
        {step === 2 && (
          <div className="absolute top-[192px] left-0 right-0 flex justify-center">
            <AgencyForm onComplete={handleStep2Complete} arrowFlying={arrowFlying} />
          </div>
        )}

        {/* Step 3 — Finishing steps */}
        {step === 3 && (
          <div className="absolute top-[192px] left-0 right-0 flex justify-center">
            <FinishingForm
              onSubmit={handleFinalSubmit}
              submitting={submitting}
              error={submitError}
            />
          </div>
        )}
      </div>
    </main>
  );
}
