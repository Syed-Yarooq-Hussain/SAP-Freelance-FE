import type { StepTarget } from "react-joyride";

import {
  getNextOnboardingPageRoute,
  STEP_TO_ROUTE,
} from "@/constants/onboarding";
import type { OnboardingStatus, OnboardingStep } from "@/types/onboarding";

const NAV_TOUR_TARGETS = new Set([
  "nav-dashboard",
  "nav-profile",
  "nav-calendar",
  "nav-account",
  "profile-menu-trigger",
]);

export function resolveTourTargetElement(
  target: StepTarget | undefined,
): HTMLElement | null {
  if (!target || typeof window === "undefined") {
    return null;
  }

  if (typeof target === "string") {
    return document.querySelector(target);
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  if (typeof target === "function") {
    return target();
  }

  if ("current" in target) {
    return target.current;
  }

  return null;
}

export function syncOnboardingTargetHighlight(
  target: StepTarget | undefined,
) {
  document
    .querySelectorAll("[data-onboarding-highlight]")
    .forEach((element) => {
      element.removeAttribute("data-onboarding-highlight");
    });

  const element = resolveTourTargetElement(target);
  if (!element) {
    return;
  }

  const tourId = element.getAttribute("data-tour");
  const highlightKind =
    tourId && NAV_TOUR_TARGETS.has(tourId) ? "nav" : "content";

  element.setAttribute("data-onboarding-highlight", highlightKind);
}

export function clearOnboardingTargetHighlight() {
  document
    .querySelectorAll("[data-onboarding-highlight]")
    .forEach((element) => {
      element.removeAttribute("data-onboarding-highlight");
    });
}

function resetScrollTop(element: Element | null) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.scrollTop = 0;
}

function waitForElement(selector: string, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    const check = () => {
      if (document.querySelector(selector)) {
        resolve(true);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        resolve(false);
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });
}

export function waitForTourTarget(
  selector: string,
  timeoutMs = 5000,
): Promise<boolean> {
  return waitForElement(selector, timeoutMs);
}

/** Scroll page to top before a tour step (e.g. calendar landing, autofill). */
export async function scrollToTopForTour() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  resetScrollTop(document.documentElement);
  resetScrollTop(document.body);
  document.querySelectorAll("main").forEach(resetScrollTop);

  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

/** @deprecated Use scrollToTopForTour */
export const scrollToTopForAutofillTour = scrollToTopForTour;

export function shouldRunOnboardingPageTour(params: {
  pageStep: OnboardingStep;
  pathname: string;
  status: OnboardingStatus | null;
  currentStep: OnboardingStep | null;
  fetchError: boolean;
  dismissed?: boolean;
}): boolean {
  const { pageStep, pathname, status, currentStep, fetchError, dismissed } =
    params;

  if (fetchError || dismissed || status === "completed") {
    return false;
  }

  if (status !== "in_progress" || !currentStep) {
    return false;
  }

  const pageRoute = STEP_TO_ROUTE[pageStep];
  if (pathname !== pageRoute && !pathname.startsWith(`${pageRoute}/`)) {
    return false;
  }

  if (currentStep === pageStep) {
    return true;
  }

  return getNextOnboardingPageRoute(currentStep) === pageRoute;
}

export function getOnboardingStepPatchForPage(
  pageStep: OnboardingStep,
  currentStep: OnboardingStep | null,
): OnboardingStep | null {
  if (!currentStep || currentStep === pageStep) {
    return null;
  }

  const pageRoute = STEP_TO_ROUTE[pageStep];
  if (getNextOnboardingPageRoute(currentStep) !== pageRoute) {
    return null;
  }

  return pageStep;
}
