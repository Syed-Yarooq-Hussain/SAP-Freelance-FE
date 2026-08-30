export const joyrideSharedOptions = {
  dismissKeyAction: false as const,
  overlayClickAction: false as const,
  buttons: [] as ("back" | "close" | "primary" | "skip")[],
  showProgress: false,
  blockTargetInteraction: false,
  disableFocusTrap: true,
  primaryColor: "#4A7AB5",
  textColor: "#1e293b",
  backgroundColor: "#ffffff",
  zIndex: 10000,
  width: "auto" as const,
  spotlightRadius: 12,
  overlayColor: "rgba(15, 23, 42, 0.55)",
};

export const joyrideSharedStyles = {
  overlay: {
    pointerEvents: "none" as const,
    position: "fixed" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
  },
  spotlight: {
    fill: "transparent",
  },
  tooltip: {
    pointerEvents: "auto" as const,
    padding: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  tooltipContainer: {
    padding: 0,
    textAlign: "left" as const,
  },
  tooltipTitle: {
    display: "none",
  },
  tooltipContent: {
    padding: 0,
  },
  tooltipFooter: {
    display: "none",
  },
  floater: {
    filter: "none",
    pointerEvents: "auto" as const,
    zIndex: 10001,
  },
  beaconWrapper: {
    pointerEvents: "auto" as const,
  },
};

/** Keep profile dropdown above the tour overlay when open during onboarding. */
export const ONBOARDING_DROPDOWN_Z_INDEX = 11000;

/** Centered modal steps (welcome / completion). */
export const onboardingCenterStepOptions = {
  placement: "center" as const,
  floatingOptions: {
    hideArrow: true,
  },
  spotlightPadding: 0,
  spotlightRadius: 0,
};
