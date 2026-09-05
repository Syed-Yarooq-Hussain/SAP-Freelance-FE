"use client";

import {
  getStepForRoute,
  getNextOnboardingPageRoute,
  getPatchStepsForPageRoute,
  NEXT_STEP,
} from "@/constants/onboarding";
import { useOnboarding } from "@/providers/OnboardingProvider";
import type { OnboardingStatus } from "@/types/onboarding";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useOnboardingNavClick() {
  const router = useRouter();
  const {
    status,
    currentStep,
    advanceStep,
    completeOnboarding,
    prepareOnboardingNavigation,
  } = useOnboarding();

  return useCallback(
    async (
      event: React.MouseEvent,
      link: string,
      onboardingStatus: OnboardingStatus | null = status,
      step = currentStep,
    ) => {
      const isActiveOnboarding =
        onboardingStatus === "in_progress" ||
        onboardingStatus === "not_started";

      if (!isActiveOnboarding) {
        return;
      }

      const effectiveStep =
        onboardingStatus === "not_started" ? "welcome" : step;
      if (!effectiveStep) {
        return;
      }

      const nextPage = getNextOnboardingPageRoute(effectiveStep);
      if (!nextPage || link !== nextPage) {
        return;
      }

      event.preventDefault();
      prepareOnboardingNavigation(link);

      const patchSteps = getPatchStepsForPageRoute(effectiveStep, link);
      for (const patchStep of patchSteps) {
        await advanceStep(patchStep);
      }

      const targetStep = getStepForRoute(link);
      if (targetStep && NEXT_STEP[targetStep] === "completed") {
        await completeOnboarding();
      }

      router.push(link);
    },
    [
      advanceStep,
      completeOnboarding,
      currentStep,
      prepareOnboardingNavigation,
      router,
      status,
    ],
  );
}
