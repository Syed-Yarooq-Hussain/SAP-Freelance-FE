import { APP_ROUTES } from "@/utils/app_routes";
import type { OnboardingStep } from "@/types/onboarding";

export type OnboardingNextStep = OnboardingStep | "completed";

/** Matches backend sequential step order (PATCH /onboarding/step body values). */
export const NEXT_STEP: Record<OnboardingStep, OnboardingNextStep> = {
  welcome: "dashboard",
  dashboard: "profile",
  profile: "calendar",
  calendar: "completed",
  my_profile: "completed",
};

export const STEP_TO_ROUTE: Record<OnboardingStep, string> = {
  welcome: APP_ROUTES.CONSULTANT.DASHBOARD,
  dashboard: APP_ROUTES.CONSULTANT.DASHBOARD,
  profile: APP_ROUTES.CONSULTANT.PROFILE,
  calendar: APP_ROUTES.CONSULTANT.CALENDAR,
  my_profile: APP_ROUTES.CONSULTANT.ACCOUNT,
};

export const AUTOFILL_RESUME_TOUR_KEY = "autofill_resume";

/** Page route for a step (`welcome` shares the dashboard page). */
export function getOnboardingPageRoute(step: OnboardingStep): string {
  return step === "welcome" ? STEP_TO_ROUTE.dashboard : STEP_TO_ROUTE[step];
}

export function getStepForRoute(route: string): OnboardingStep | null {
  if (route === STEP_TO_ROUTE.my_profile) return "my_profile";
  if (route === APP_ROUTES.CONSULTANT.ACCOUNT) return "my_profile";
  if (route === STEP_TO_ROUTE.calendar) return "calendar";
  if (route === STEP_TO_ROUTE.profile) return "profile";
  if (route === STEP_TO_ROUTE.dashboard) return "dashboard";
  return null;
}

/** Ordered PATCH steps from `from` through `to` (inclusive), derived from NEXT_STEP. */
export function getPatchStepsBetween(
  from: OnboardingStep,
  to: OnboardingStep,
): OnboardingStep[] {
  const steps: OnboardingStep[] = [];
  let current: OnboardingStep = from;

  while (true) {
    const next: OnboardingNextStep = NEXT_STEP[current];
    if (next === "completed") {
      break;
    }

    steps.push(next);
    if (next === to) {
      break;
    }

    current = next;
  }

  return steps;
}

/** Next page route in the tour (UI navigation — skips same-page backend steps). */
export function getNextOnboardingPageRoute(
  step: OnboardingStep,
): string | null {
  let next: OnboardingNextStep = NEXT_STEP[step];

  while (next !== "completed") {
    if (getOnboardingPageRoute(next) !== getOnboardingPageRoute(step)) {
      return STEP_TO_ROUTE[next];
    }
    next = NEXT_STEP[next];
  }

  return null;
}

/** Ordered PATCH steps required before navigating to the next tour page. */
export function getPatchStepsForPageRoute(
  currentStep: OnboardingStep,
  targetRoute: string,
): OnboardingStep[] {
  const nextPage = getNextOnboardingPageRoute(currentStep);
  if (!nextPage || targetRoute !== nextPage) {
    return [];
  }

  const targetStep = getStepForRoute(targetRoute);
  if (!targetStep) {
    return [];
  }

  return getPatchStepsBetween(currentStep, targetStep);
}
