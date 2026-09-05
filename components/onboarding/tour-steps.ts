import type { Step } from "react-joyride";

import { scrollToTopForTour } from "./onboarding-tour-utils";

export const dashboardTourSteps: Step[] = [
  {
    target: '[data-tour="nav-dashboard"]',
    title: "Portal Tour",
    content:
      "Take a quick tour of the portal and discover the tools that help you manage your profile, availability, projects, and payments - all in one place.",
    placement: "right",
    data: { progressTotal: 2 },
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-profile"]',
    title: "My Profile",
    content:
      "Showcase your professional experience, expertise, education, and certifications to discover the right opportunities for you.",
    placement: "right",
    data: {
      variant: "nav-link",
      progressTotal: 2,
      primaryLabel: "Open Profile",
    },
    blockTargetInteraction: false,
  },
];

export const profileTourSteps: Step[] = [
  {
    target: '[data-tour="profile-completion"]',
    title: "Profile Completion",
    content:
      "Track your profile strength and complete each section to improve your visibility and your chances of getting matched with relevant opportunities.",
    placement: "right",
    data: { progressTotal: 3 },
    skipBeacon: true,
  },
  {
    target: '[data-tour="autofill-resume"]',
    title: "Autofill Your Profile",
    content:
      "Save time by uploading your CV. We'll automatically extract your key details to help complete your profile faster.",
    placement: "bottom",
    before: scrollToTopForTour,
    data: { progressTotal: 3, primaryLabel: "Get Started" },
  },
  {
    target: '[data-tour="nav-calendar"]',
    title: "Your Calendar",
    content: "Manage your availability, meetings, and upcoming commitments.",
    placement: "right",
    data: {
      variant: "nav-link",
      progressTotal: 3,
      primaryLabel: "Open Calendar",
    },
    blockTargetInteraction: false,
  },
];

export const autofillResumeTourSteps: Step[] = [
  {
    target: '[data-tour="autofill-resume"]',
    title: "Autofill Your Profile",
    content:
      "Save time by uploading your CV. We'll automatically extract your key details to help complete your profile faster.",
    placement: "bottom",
    before: scrollToTopForTour,
    data: { progressTotal: 3, primaryLabel: "Get Started" },
    skipBeacon: true,
  },
];
