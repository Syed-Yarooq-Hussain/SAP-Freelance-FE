"use client";

import AppNavbar from "@/components/AppNavbar";
import StepProgress from "@/components/StepProgress";
import TeamConfirmation from "@/components/specific/teambuilder/TeamConfirmation";
import TeamCreation from "@/components/specific/teambuilder/TeamCreation";
import TeamPayments from "@/components/specific/teambuilder/TeamPayments";
import TeamProjects from "@/components/specific/teambuilder/TeamProjects";
import { teamBuilderSteps } from "@/data/teamBuilder";
import { TeamBuilderRow } from "@/types/teamBuilder";
import { useProjectProgress } from "@/utils/useProjectProgress";
import { Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

function TeamBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateProjectStep } = useProjectProgress();
  const stepParam = searchParams.get("step");
  const projectParam = searchParams.get("projectId");
  const [activeStep, setActiveStep] = useState(
    stepParam ? Math.max(1, Math.min(4, Number(stepParam))) : 1
  );
  const [projectId, setProjectId] = useState<string | null>(projectParam);
  const lastSavedStepRef = useRef<number | null>(null);
  const [teamCreationRows, setTeamCreationRows] = useState<TeamBuilderRow[]>(
    []
  );
  const [teamCreationSelectedIds, setTeamCreationSelectedIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (!projectParam) return;
    setProjectId((prev) => (prev !== projectParam ? projectParam : prev));
  }, [projectParam]);

  useEffect(() => {
    if (projectId) return;

    const resume = localStorage.getItem("tb_project_in_progress");
    const stored = localStorage.getItem("tb_project_id");

    if (resume === "true" && stored) {
      setProjectId(stored);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    if (lastSavedStepRef.current === activeStep) return;

    lastSavedStepRef.current = activeStep;
    updateProjectStep(projectId, activeStep);
  }, [projectId, activeStep, updateProjectStep]);

  useEffect(() => {
    const currentStep = searchParams.get("step");
    const currentPid = searchParams.get("projectId");

    if (currentStep === String(activeStep) && currentPid === projectId) return;

    const q = new URLSearchParams();
    q.set("step", String(activeStep));
    if (projectId) q.set("projectId", projectId);

    router.replace(`?${q.toString()}`, { scroll: false });
  }, [activeStep, projectId, router, searchParams]);

  const goStep2 = (id: string) => {
    setProjectId(id);
    setActiveStep(2);
  };

  const discardFromStep2 = () => {
    setActiveStep(1);
  };

  const discardFromStep3 = () => {
    setActiveStep(2);
  };

  const discardFromStep4 = () => {
    setActiveStep(3);
  };

  const current = useMemo(() => {
    switch (activeStep) {
      case 1:
        return (
          <TeamCreation
            onNext={goStep2}
            projectId={projectId}
            rows={teamCreationRows}
            setRows={setTeamCreationRows}
            selectedIds={teamCreationSelectedIds}
            setSelectedIds={setTeamCreationSelectedIds}
          />
        );

      case 2:
        return (
          <TeamConfirmation
            projectId={projectId}
            onNext={(id) => {
              setProjectId(id);
              setActiveStep(3);
            }}
            onDiscard={discardFromStep2}
          />
        );

      case 3:
        return (
          <TeamProjects
            projectId={projectId}
            onBack={discardFromStep3}
            onNext={(id) => {
              setProjectId(id);
              setActiveStep(4);
            }}
          />
        );

      case 4:
        return projectId ? (
          <TeamPayments projectId={projectId} onDiscard={discardFromStep4} />
        ) : null;

      default:
        return (
          <TeamCreation
            onNext={goStep2}
            projectId={projectId}
            rows={teamCreationRows}
            setRows={setTeamCreationRows}
            selectedIds={teamCreationSelectedIds}
            setSelectedIds={setTeamCreationSelectedIds}
          />
        );
    }
  }, [activeStep, projectId, teamCreationRows, teamCreationSelectedIds]);

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
