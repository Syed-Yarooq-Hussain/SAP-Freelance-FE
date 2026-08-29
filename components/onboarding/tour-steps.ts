import type { Step } from "react-joyride";

import { ensureProfileMenuOpenForTour } from "@/constants/onboarding-events";

import { onboardingCenterStepOptions } from "./joyride-config";
import { scrollToTopForTour } from "./onboarding-tour-utils";

const welcomeStep: Step = {
  target: "body",
  title: "Welcome to ConsultCrew",
  content:
    "Let's take a quick tour of your consultant portal and explore the tools that help you manage your profile, availability, and client connections.",
  data: {
    variant: "welcome",
    primaryLabel: "Get Started",
    progressTotal: 3,
  },
  ...onboardingCenterStepOptions,
  skipScroll: true,
  skipBeacon: true,
};

export const dashboardTourSteps: Step[] = [
  welcomeStep,
  {
    target: '[data-tour="nav-dashboard"]',
    title: "Your Dashboard",
    content:
      "This is your central workspace for managing your SAP consulting activities. Get a quick overview of your projects, upcoming tasks, client activity, and important updates.",
    placement: "right",
    data: { progressTotal: 3 },
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-profile"]',
    title: "Your Profile",
    content:
      "This is where you manage your professional information, SAP expertise, experience, and certifications. Keep your profile up to date so clients can quickly understand your skills and connect with you.",
    placement: "right",
    data: { variant: "nav-link", progressTotal: 3 },
    blockTargetInteraction: false,
  },
];

export const profileTourSteps: Step[] = [
  {
    target: '[data-tour="profile-completion"]',
    title: "Profile completion",
    content:
      "Track your profile strength here. Complete each section to improve visibility to clients.",
    placement: "right",
    data: { progressTotal: 3 },
    skipBeacon: true,
  },
  {
    target: '[data-tour="profile-professional-info"]',
    title: "Professional details",
    content:
      "Add your work experience, education, and certifications so clients can evaluate your expertise.",
    placement: "top",
    data: { progressTotal: 3 },
  },
  {
    target: '[data-tour="autofill-resume"]',
    title: "Autofill Your Profile",
    content:
      "Save time by uploading your resume. We'll automatically extract your professional experience, SAP expertise, certifications, and key details to help complete your profile faster.",
    placement: "bottom",
    before: scrollToTopForTour,
    data: { progressTotal: 3, primaryLabel: "Get Started" },
  },
  {
    target: '[data-tour="nav-calendar"]',
    title: "Your Calendar",
    content:
      "This is where you manage your consulting schedule, meetings, and upcoming commitments. Keep track of client sessions and stay organized with a clear view of your availability.",
    placement: "right",
    data: { variant: "nav-link", progressTotal: 3 },
    blockTargetInteraction: false,
  },
];

export const calendarTourSteps: Step[] = [
  {
    target:
      '[data-tour="calendar-events"], [data-tour="calendar-events-mobile"]',
    title: "Your schedule",
    content:
      "View upcoming meetings and events here so you never miss an important appointment.",
    placement: "bottom",
    before: scrollToTopForTour,
    skipScroll: true,
    data: { progressTotal: 3 },
    skipBeacon: true,
  },
  {
    target: '[data-tour="calendar-availability"]',
    title: "Set availability",
    content:
      "Configure your weekly availability so clients know when you can take on projects.",
    placement: "bottom",
    data: { progressTotal: 3 },
  },
  {
    target: '[data-tour="profile-menu-trigger"]',
    title: "Your profile menu",
    content:
      "Open your profile menu from here to access account settings and personal options.",
    placement: "bottom",
    data: { progressTotal: 3, primaryLabel: "Next" },
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-account"]',
    title: "Account Settings",
    content:
      "Select Account Settings to add your basic info and finish onboarding.",
    placement: "left",
    before: ensureProfileMenuOpenForTour,
    targetWaitTimeout: 5000,
    data: { variant: "nav-link", progressTotal: 3 },
    blockTargetInteraction: false,
  },
];

export const accountTourSteps: Step[] = [
  {
    target: '[data-tour="account-settings"]',
    title: "Your basic info",
    content:
      "Here you add your basic info — name, contact details, and LinkedIn profile.",
    placement: "top",
    data: { progressTotal: 1, primaryLabel: "Done" },
    skipScroll: true,
    skipBeacon: true,
  },
];

export const autofillResumeTourSteps: Step[] = [
  {
    target: '[data-tour="autofill-resume"]',
    title: "Autofill Your Profile",
    content:
      "Save time by uploading your resume. We'll automatically extract your professional experience, SAP expertise, certifications, and key details to help complete your profile faster.",
    placement: "bottom",
    before: scrollToTopForTour,
    data: { progressTotal: 3, primaryLabel: "Get Started" },
    skipBeacon: true,
  },
];
