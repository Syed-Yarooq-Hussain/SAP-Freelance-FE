'use client';

import { useConsultantDashboard } from '@/actions/consultants/useConsultantDashboard';
import DashboardPage from '@/components/consultant-dashboard-new';
import { PageOnboardingTour } from '@/components/onboarding/PageOnboardingTour';
import { dashboardTourSteps } from '@/components/onboarding/tour-steps';
import Sidebar from '@/components/Sidebar';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { DashboardData } from '@/types/dashboard';
import { useEffect, useMemo, useState } from 'react';

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useConsultantDashboard();
  const { currentStep, status, fetchError } = useOnboarding();
  const [targetsReady, setTargetsReady] = useState(false);

  const shouldRunTour = useMemo(() => {
    if (fetchError || status === 'completed') return false;
    if (status === 'not_started') return true;
    return currentStep === 'welcome' || currentStep === 'dashboard';
  }, [currentStep, fetchError, status]);

  useEffect(() => {
    if (!shouldRunTour) {
      setTargetsReady(false);
      return;
    }

    if (isLoading || !dashboardData) {
      setTargetsReady(false);
      return;
    }

    setTargetsReady(true);
  }, [shouldRunTour, isLoading, dashboardData]);

  return (
    <Sidebar>
      <DashboardPage data={dashboardData as DashboardData} />
      {!fetchError && (
        <PageOnboardingTour
          pageStep="dashboard"
          steps={dashboardTourSteps}
          run={shouldRunTour && targetsReady}
        />
      )}
    </Sidebar>
  );
}
