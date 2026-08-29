export type OnboardingTourVariant =
  | "welcome"
  | "default"
  | "completion"
  | "nav-link";

export type OnboardingTourStepData = {
  variant?: OnboardingTourVariant;
  primaryLabel?: string;
  progressTotal?: number;
  /** Optional subtitle shown on completion modal */
  subtitle?: string;
  /** Checklist of completed milestones on the final step */
  highlights?: string[];
};
