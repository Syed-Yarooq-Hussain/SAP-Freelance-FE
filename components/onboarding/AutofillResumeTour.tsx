"use client";

import { AUTOFILL_RESUME_TOUR_KEY } from "@/constants/onboarding";
import { useOnboarding } from "@/providers/OnboardingProvider";
import {
  getFeatureTourService,
  patchFeatureTourService,
} from "@/services/onboarding";
import { useCallback, useEffect, useRef, useState } from "react";
import { EVENTS, type EventData } from "react-joyride";
import { autofillResumeTourSteps } from "./tour-steps";
import { OnboardingJoyride } from "./OnboardingJoyride";
import { clearOnboardingTargetHighlight } from "./onboarding-tour-utils";

type AutofillResumeTourProps = {
  targetsReady: boolean;
};

export function AutofillResumeTour({ targetsReady }: AutofillResumeTourProps) {
  const { status: mainTourStatus } = useOnboarding();
  const [tourStatus, setTourStatus] = useState<
    "loading" | "completed" | "ready" | "error"
  >("loading");
  const [shouldMount, setShouldMount] = useState(false);
  const [run, setRun] = useState(false);
  const completionHandledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getFeatureTourService(AUTOFILL_RESUME_TOUR_KEY);
        if (cancelled) return;

        if (data?.status === "completed") {
          setTourStatus("completed");
          return;
        }

        setTourStatus("ready");
      } catch (error) {
        console.error("Failed to fetch autofill resume tour status:", error);
        if (!cancelled) {
          setTourStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mainTourStatus !== "completed" || tourStatus !== "ready") {
      setShouldMount(false);
      setRun(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldMount(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [mainTourStatus, tourStatus]);

  useEffect(() => {
    if (shouldMount && targetsReady && tourStatus === "ready") {
      setRun(true);
    }
  }, [shouldMount, targetsReady, tourStatus]);

  useEffect(() => {
    if (!run) {
      clearOnboardingTargetHighlight();
    }

    return () => {
      clearOnboardingTargetHighlight();
    };
  }, [run]);

  const handleEvent = useCallback((data: EventData) => {
    const { type, index, action } = data;

    if (type === EVENTS.TOUR_END) {
      clearOnboardingTargetHighlight();
    }

    if (
      type !== EVENTS.STEP_AFTER ||
      index !== autofillResumeTourSteps.length - 1
    ) {
      return;
    }

    if (action === "close" || action === "skip") {
      return;
    }

    if (completionHandledRef.current) {
      return;
    }

    completionHandledRef.current = true;

    void patchFeatureTourService(AUTOFILL_RESUME_TOUR_KEY, "completed")
      .then(() => {
        setTourStatus("completed");
        setRun(false);
      })
      .catch((error) => {
        console.error("Failed to complete autofill resume tour:", error);
        completionHandledRef.current = false;
      });
  }, []);

  if (
    tourStatus === "loading" ||
    tourStatus === "completed" ||
    tourStatus === "error" ||
    !shouldMount
  ) {
    return null;
  }

  return (
    <OnboardingJoyride
      steps={autofillResumeTourSteps}
      run={run}
      onEvent={handleEvent}
    />
  );
}
