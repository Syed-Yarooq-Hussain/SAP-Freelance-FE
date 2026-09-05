"use client";

import AppNavbar from "@/components/AppNavbar";
import StepProgress from "@/components/StepProgress";
import TeamCreation from "@/components/specific/teambuilder/TeamCreation";
import { teamBuilderSteps } from "@/data/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import { TeamBuilderRow } from "@/types/teamBuilder";
import { useProjectProgress } from "@/utils/useProjectProgress";
import { Box } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

const TeamConfirmation = dynamic(
  () => import("@/components/specific/teambuilder/TeamConfirmation"),
  { ssr: false }
);
const TeamProjects = dynamic(
  () => import("@/components/specific/teambuilder/TeamProjects"),
  { ssr: false }
);
const TeamPayments = dynamic(
  () => import("@/components/specific/teambuilder/TeamPayments"),
  { ssr: false }
);

function TeamBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateProjectStep } = useProjectProgress();
  const { toast } = useToast();
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

  const canAccessStep = (step: number) => {
    if (step === 1) return true;
    return Boolean(projectId);
  };

  const goToStep = (step: number) => {
    if (step === activeStep) return;
    if (!projectId && step > 1) {
      toast("Create the project first to open this step.", "info");
      return;
    }
    setActiveStep(step);
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F4F5F8",
        pt: { xs: 10, md: 11 },
        px: { xs: 1.5, sm: 2.5, md: 4 },
        pb: 5,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto" }}>
        <Box sx={{ mb: 2.5 }}>
          <StepProgress
            steps={teamBuilderSteps}
            activeStep={activeStep}
            onStepClick={goToStep}
            isStepAccessible={canAccessStep}
          />
        </Box>
        <Box
          sx={{
            "& > div": {
              borderRadius: { xs: "16px", md: "20px" },
            },
          }}
        >
          {current}
        </Box>
      </Box>
    </Box>
  );
}

export default function TeamBuilderPage() {
  return (
    <>
      <AppNavbar showSidebar={false} />
      <Suspense
        fallback={
          <Box sx={{ minHeight: "100vh", bgcolor: "#F4F5F8", pt: 12, px: 3, color: "#64748B" }}>
            Loading team builder...
          </Box>
        }
      >
        <TeamBuilderContent />
      </Suspense>
    </>
  );
}
