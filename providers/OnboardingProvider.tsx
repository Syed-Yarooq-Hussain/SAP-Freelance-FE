"use client";

import { Roles } from "@/constants/roles";
import {
  getNextOnboardingPageRoute,
  getOnboardingPageRoute,
  STEP_TO_ROUTE,
} from "@/constants/onboarding";
import {
  completeOnboardingService,
  patchOnboardingStepService,
  getOnboardingStatusService,
} from "@/services/onboarding";
import type {
  OnboardingStatus,
  OnboardingStep,
} from "@/types/onboarding";
import { APP_ROUTES } from "@/utils/app_routes";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const CONSULTANT_ROUTE_PREFIX = APP_ROUTES.CONSULTANT.DASHBOARD.replace(
  "/dashboard",
  "",
);
const ONBOARDING_FETCH_TIMEOUT_MS = 10_000;

const ONBOARDING_STEPS = new Set<string>([
  "welcome",
  "dashboard",
  "profile",
  "calendar",
  "my_profile",
]);

const ONBOARDING_STEP_ALIASES: Record<string, OnboardingStep> = {
  account: "my_profile",
  myprofile: "my_profile",
};

function normalizeOnboardingStep(value: unknown): OnboardingStep | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/-/g, "_");
  const aliased = ONBOARDING_STEP_ALIASES[normalized];

  if (aliased) {
    return aliased;
  }

  return ONBOARDING_STEPS.has(normalized)
    ? (normalized as OnboardingStep)
    : null;
}

function normalizeOnboardingStatus(value: unknown): OnboardingStatus | null {
  if (value === "not_started" || value === "in_progress" || value === "completed") {
    return value;
  }
  return null;
}

export function getAllowedOnboardingRoutes(
  status: OnboardingStatus | null,
  currentStep: OnboardingStep | null,
  pendingStep: OnboardingStep | null,
): string[] {
  if (status === "not_started") {
    const routes = [STEP_TO_ROUTE.dashboard];
    const nextPage = getNextOnboardingPageRoute("welcome");
    if (nextPage) {
      routes.push(nextPage);
    }
    return routes;
  }

  if (status !== "in_progress" || !currentStep) {
    return [];
  }

  const routes = new Set<string>([getOnboardingPageRoute(currentStep)]);

  const nextPage = getNextOnboardingPageRoute(currentStep);
  if (nextPage) {
    routes.add(nextPage);
  }

  if (pendingStep) {
    routes.add(STEP_TO_ROUTE[pendingStep]);
  }

  return Array.from(routes);
}

export function isPathAllowedForOnboarding(
  pathname: string,
  allowedRoutes: string[],
): boolean {
  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

type OnboardingContextValue = {
  status: OnboardingStatus | null;
  currentStep: OnboardingStep | null;
  loading: boolean;
  fetchError: boolean;
  isConsultantOnboarding: boolean;
  advanceStep: (step: OnboardingStep) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  prepareOnboardingNavigation: (route: string) => void;
  applyStatusResponse: (response: {
    status: OnboardingStatus;
    currentStep: OnboardingStep;
  }) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const role = session?.user?.role;
  const isConsultant = Number(role) === Roles.CONSULTANT;

  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [pendingStep, setPendingStep] = useState<OnboardingStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [hasResolved, setHasResolved] = useState(false);
  const advancingRef = useRef<string | null>(null);
  const fetchGenerationRef = useRef(0);
  const currentStepRef = useRef<OnboardingStep | null>(null);
  const pendingRouteRef = useRef<string | null>(null);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (!isConsultant) {
      setLoading(false);
      setFetchError(false);
      setHasResolved(true);
      setStatus(null);
      setCurrentStep(null);
      setPendingStep(null);
      return;
    }

    const generation = ++fetchGenerationRef.current;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setFetchError(false);
      setHasResolved(false);

      const timeoutId = window.setTimeout(() => {
        if (cancelled || generation !== fetchGenerationRef.current) return;
        console.error("Onboarding status fetch timed out");
        setFetchError(true);
        setStatus(null);
        setCurrentStep(null);
        setPendingStep(null);
        setLoading(false);
        setHasResolved(true);
      }, ONBOARDING_FETCH_TIMEOUT_MS);

      try {
        const data = await getOnboardingStatusService();
        if (
          cancelled ||
          generation !== fetchGenerationRef.current ||
          !data
        ) {
          return;
        }

        const nextStatus = normalizeOnboardingStatus(data.status);
        const nextStep = normalizeOnboardingStep(data.currentStep);

        if (!nextStatus) {
          throw new Error("Invalid onboarding status response");
        }

        setStatus(nextStatus);
        setCurrentStep(
          nextStatus === "not_started" ? "welcome" : nextStep ?? "welcome",
        );
      } catch (error) {
        console.error("Failed to fetch onboarding status:", error);
        if (cancelled || generation !== fetchGenerationRef.current) return;
        setFetchError(true);
        setStatus(null);
        setCurrentStep(null);
        setPendingStep(null);
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled && generation === fetchGenerationRef.current) {
          setLoading(false);
          setHasResolved(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, isConsultant]);

  const applyStatusResponse = useCallback(
    (response: { status: OnboardingStatus; currentStep: OnboardingStep }) => {
      const nextStatus = normalizeOnboardingStatus(response.status);
      const nextStep = normalizeOnboardingStep(response.currentStep);

      if (!nextStatus) {
        return;
      }

      setStatus(nextStatus);
      setCurrentStep(
        nextStatus === "not_started" ? "welcome" : nextStep ?? "welcome",
      );
      setPendingStep(null);
    },
    [],
  );

  const prepareOnboardingNavigation = useCallback((route: string) => {
    pendingRouteRef.current = route;
  }, []);

  const advanceStep = useCallback(
    async (step: OnboardingStep) => {
      if (advancingRef.current === step) {
        return;
      }

      advancingRef.current = step;
      const previousStep = currentStepRef.current;
      pendingRouteRef.current = STEP_TO_ROUTE[step];
      setPendingStep(step);
      setCurrentStep(step);
      setStatus((prev) => (prev === "completed" ? prev : "in_progress"));

      try {
        const response = await patchOnboardingStepService(step);
        if (response) {
          applyStatusResponse(response);
        }
      } catch (error) {
        console.error("Failed to advance onboarding step:", error);
        setCurrentStep(previousStep);
        setPendingStep(null);
        pendingRouteRef.current = null;
      } finally {
        advancingRef.current = null;
      }
    },
    [applyStatusResponse],
  );

  const completeOnboarding = useCallback(async () => {
    try {
      const response = await completeOnboardingService();
      if (response) {
        applyStatusResponse(response);
      } else {
        setStatus("completed");
        setCurrentStep("my_profile");
        setPendingStep(null);
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  }, [applyStatusResponse]);

  const value = useMemo(
    () => ({
      status,
      currentStep,
      loading: isConsultant ? loading : false,
      fetchError,
      isConsultantOnboarding: isConsultant,
      advanceStep,
      completeOnboarding,
      prepareOnboardingNavigation,
      applyStatusResponse,
    }),
    [
      status,
      currentStep,
      loading,
      fetchError,
      isConsultant,
      advanceStep,
      completeOnboarding,
      prepareOnboardingNavigation,
      applyStatusResponse,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>
      <OnboardingGateInner
        hasResolved={hasResolved}
        pendingStep={pendingStep}
        pendingRouteRef={pendingRouteRef}
      >
        {children}
      </OnboardingGateInner>
    </OnboardingContext.Provider>
  );
}

function OnboardingGateInner({
  children,
  hasResolved,
  pendingStep,
  pendingRouteRef,
}: {
  children: ReactNode;
  hasResolved: boolean;
  pendingStep: OnboardingStep | null;
  pendingRouteRef: React.MutableRefObject<string | null>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, status, currentStep, fetchError, isConsultantOnboarding } =
    useOnboarding();
  const lastRedirectTargetRef = useRef<string | null>(null);

  const isConsultantRoute = pathname.startsWith(CONSULTANT_ROUTE_PREFIX);

  useEffect(() => {
    if (
      !isConsultantOnboarding ||
      !isConsultantRoute ||
      !hasResolved ||
      loading ||
      fetchError
    ) {
      return;
    }

    if (status === "completed" || !status) {
      lastRedirectTargetRef.current = null;
      return;
    }

    const allowedRoutes = [
      ...getAllowedOnboardingRoutes(status, currentStep, pendingStep),
      ...(pendingRouteRef.current ? [pendingRouteRef.current] : []),
    ];

    if (isPathAllowedForOnboarding(pathname, allowedRoutes)) {
      pendingRouteRef.current = null;
      lastRedirectTargetRef.current = null;
      return;
    }

    const fallbackRoute =
      status === "not_started"
        ? STEP_TO_ROUTE.dashboard
        : currentStep
          ? getOnboardingPageRoute(currentStep)
          : STEP_TO_ROUTE.dashboard;

    if (
      pathname === fallbackRoute ||
      lastRedirectTargetRef.current === fallbackRoute
    ) {
      return;
    }

    lastRedirectTargetRef.current = fallbackRoute;
    router.replace(fallbackRoute);
  }, [
    loading,
    status,
    currentStep,
    pendingStep,
    pathname,
    router,
    fetchError,
    isConsultantOnboarding,
    isConsultantRoute,
    hasResolved,
  ]);

  if (isConsultantOnboarding && loading && isConsultantRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0F1F3]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

export function isNavLinkLocked(
  link: string,
  status: OnboardingStatus | null,
  currentStep: OnboardingStep | null,
): boolean {
  if (!status || status === "completed") {
    return false;
  }

  if (status === "not_started") {
    return !isPathAllowedForOnboarding(
      link,
      getAllowedOnboardingRoutes(status, "welcome", null),
    );
  }

  if (status !== "in_progress" || !currentStep) {
    return false;
  }

  return !isPathAllowedForOnboarding(
    link,
    getAllowedOnboardingRoutes(status, currentStep, null),
  );
}
