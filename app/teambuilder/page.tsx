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
import colors from "@/utils/styles/colors";
import { Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function TeamBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const initialStep = stepParam ? Number(stepParam) : 1;
  const [activeStep, setActiveStep] = useState(
    Math.max(1, Math.min(4, initialStep))
  );

  useEffect(() => {
    const q = new URLSearchParams(Array.from(searchParams.entries()));
    q.set("step", String(activeStep));
    router.replace(`?${q.toString()}`, { scroll: false });
  }, [activeStep, searchParams, router]);

  const goStep2 = () => setActiveStep(2);
  const goStep3 = () => setActiveStep(3);
  const goStep4 = () => setActiveStep(4);

  const current = useMemo(() => {
    switch (activeStep) {
      case 1:
        return (
          <Step01
            onNext={goStep2}
            onDiscard={() => console.log("Discard clicked")}
          />
        );
      case 2:
        return <TeamConfirmation onNext={goStep3} />;
      case 3:
        return <TeamProjects onBack={goStep2} onNext={goStep4} />;
      case 4:
        return <TeamPayments />;
      default:
        return <TeamCreation onNext={goStep2} />;
    }
  }, [activeStep]);

  return (
    <Box sx={{ mt: 10, px: 4 }}>
      <StepProgress
        steps={teamBuilderSteps}
        activeStep={activeStep}
        activeColor={colors.RED}
      />
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
