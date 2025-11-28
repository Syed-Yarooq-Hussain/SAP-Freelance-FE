"use client";

import AppNavbar from "@/components/AppNavbar";
import StepProgress from "@/components/StepProgress";
import TeamConfirmation from "@/components/specific/teambuilder/TeamConfirmation";
import {
  default as Step01,
  default as TeamCreation,
} from "@/components/specific/teambuilder/TeamCreation";
import TeamPayments from "@/components/specific/teambuilder/TeamPayments";
import TeamProjects from "@/components/specific/teambuilder/TeamProjects";
import { teamBuilderSteps } from "@/data/teamBuilder";
import { Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function TeamBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get("step");
  const projectParam = searchParams.get("projectId");

  const [activeStep, setActiveStep] = useState(
    stepParam ? Math.max(1, Math.min(4, Number(stepParam))) : 1
  );
  const [projectId, setProjectId] = useState<string | null>(projectParam);

  useEffect(() => {
    const q = new URLSearchParams(Array.from(searchParams.entries()));

    q.set("step", String(activeStep));

    if (projectId) {
      q.set("projectId", projectId);
    }

    router.replace(`?${q.toString()}`, { scroll: false });
  }, [activeStep, projectId, searchParams, router]);

  const goStep2 = (id: string) => {
    setProjectId(id);
    setActiveStep(2);
  };

  const current = useMemo(() => {
    switch (activeStep) {
      case 1:
        return <Step01 onNext={goStep2} />;

      case 2:
        return (
          <TeamConfirmation
            projectId={projectId}
            onNext={(id) => {
              setProjectId(id);
              setActiveStep(3);
            }}
          />
        );

      case 3:
        return (
          <TeamProjects
            projectId={projectId}
            onBack={() => setActiveStep(2)}
            onNext={() => setActiveStep(4)}
          />
        );

      case 4:
        return <TeamPayments />;

      default:
        return <TeamCreation onNext={goStep2} />;
    }
  }, [activeStep, projectId]);

  return (
    <Box sx={{ mt: 10, px: 4 }}>
      <StepProgress steps={teamBuilderSteps} activeStep={activeStep} />
      {current}
    </Box>
  );
}

export default function TeamBuilderPage() {
  return (
    <>
      <AppNavbar showSidebar={false} />
      <Suspense fallback={<Box sx={{ mt: 10, px: 4 }}>Loading...</Box>}>
        <TeamBuilderContent />
      </Suspense>
    </>
  );
}
