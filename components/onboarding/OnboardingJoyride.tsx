"use client";

import "./onboarding-tour.css";

import type { EventHandler, Step } from "react-joyride";
import { Joyride } from "react-joyride";

import {
  joyrideSharedOptions,
  joyrideSharedStyles,
} from "./joyride-config";
import { OnboardingTooltip } from "./OnboardingTooltip";

type OnboardingJoyrideProps = {
  steps: Step[];
  run: boolean;
  onEvent?: EventHandler;
  scrollToFirstStep?: boolean;
};

export function OnboardingJoyride({
  steps,
  run,
  onEvent,
  scrollToFirstStep = true,
}: OnboardingJoyrideProps) {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep={scrollToFirstStep}
      onEvent={onEvent}
      tooltipComponent={OnboardingTooltip}
      options={joyrideSharedOptions}
      styles={joyrideSharedStyles}
    />
  );
}
