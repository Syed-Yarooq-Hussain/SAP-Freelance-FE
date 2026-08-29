"use client";

import { NEXT_STEP } from "@/constants/onboarding";
import { dispatchCloseProfileMenuEvent } from "@/constants/onboarding-events";
import { useOnboarding } from "@/providers/OnboardingProvider";
import type { OnboardingTourStepData } from "@/types/onboarding-tour";
import type { OnboardingStep } from "@/types/onboarding";
import { useCallback, useEffect, useRef } from "react";
import { EVENTS, type EventData, type Step } from "react-joyride";

import { OnboardingJoyride } from "./OnboardingJoyride";
import {
  clearOnboardingTargetHighlight,
  syncOnboardingTargetHighlight,
} from "./onboarding-tour-utils";

type PageOnboardingTourProps = {
  pageStep: OnboardingStep;
  steps: Step[];
  run: boolean;
  /** When true, last-step Next won't PATCH/complete — caller handles completion. */
  deferPageCompletion?: boolean;
  /** Keep tour mountable while onboarding status is already completed (account finale). */
  allowWhenCompleted?: boolean;
  onBeforeStep?: (index: number) => void;
  onStepAfter?: (index: number) => void;
};

export function PageOnboardingTour({
  pageStep,
  steps,
  run,
  deferPageCompletion = false,
  allowWhenCompleted = false,
  onBeforeStep,
  onStepAfter,
}: PageOnboardingTourProps) {
  const { advanceStep, completeOnboarding, status } = useOnboarding();
  const handledTransitionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!run) {
      clearOnboardingTargetHighlight();
    }

    return () => {
      clearOnboardingTargetHighlight();
    };
  }, [run]);

  const handleEvent = useCallback(
    (data: EventData) => {
      const { type, index, action, step } = data;

      if (type === EVENTS.STEP_BEFORE) {
        syncOnboardingTargetHighlight(step.target);

        const targetSelector =
          typeof step.target === "string" ? step.target : "";
        const isAccountTourStep =
          targetSelector.includes("nav-account") ||
          targetSelector.includes("profile-menu-trigger");
        if (!isAccountTourStep) {
          dispatchCloseProfileMenuEvent();
        }

        onBeforeStep?.(index);
        return;
      }

      if (type === EVENTS.TOUR_END) {
        clearOnboardingTargetHighlight();
        dispatchCloseProfileMenuEvent();
        return;
      }

      if (type === EVENTS.TOUR_STATUS) {
        clearOnboardingTargetHighlight();
        return;
      }

      if (type !== EVENTS.STEP_AFTER) {
        return;
      }

      if (action === "close" || action === "skip") {
        return;
      }

      if (index !== steps.length - 1) {
        onStepAfter?.(index);
        return;
      }

      const stepData = (step.data ?? {}) as OnboardingTourStepData;
      if (stepData.variant === "nav-link") {
        return;
      }

      if (deferPageCompletion) {
        onStepAfter?.(index);
        return;
      }

      const nextStep = NEXT_STEP[pageStep];
      const transitionKey = `${pageStep}->${nextStep}`;
      if (handledTransitionRef.current === transitionKey) {
        return;
      }

      handledTransitionRef.current = transitionKey;

      if (nextStep === "completed") {
        void completeOnboarding();
      } else {
        void advanceStep(nextStep);
      }

      window.setTimeout(() => {
        if (handledTransitionRef.current === transitionKey) {
          handledTransitionRef.current = null;
        }
      }, 1000);
    },
    [
      advanceStep,
      completeOnboarding,
      deferPageCompletion,
      onBeforeStep,
      onStepAfter,
      pageStep,
      steps.length,
    ],
  );

  if (status === "completed" && !allowWhenCompleted) {
    return null;
  }

  if (!run) {
    return null;
  }

  return (
    <OnboardingJoyride steps={steps} run onEvent={handleEvent} />
  );
}
