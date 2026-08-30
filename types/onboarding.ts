export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export type OnboardingStep =
  | "welcome"
  | "dashboard"
  | "profile"
  | "calendar"
  | "my_profile";

export type FeatureTourStatus = "not_started" | "in_progress" | "completed";

export interface OnboardingStatusResponse {
  status: OnboardingStatus;
  currentStep: OnboardingStep;
  startedAt: string | null;
  completedAt: string | null;
}

export interface FeatureTourResponse {
  key: string;
  status: FeatureTourStatus;
}
