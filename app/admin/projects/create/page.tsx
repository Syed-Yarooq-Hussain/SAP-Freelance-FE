"use client";

import { useAdminClients } from "@/actions/admin/useAdminClients";
import AdminClientSelection, {
  type AdminProjectClient,
} from "@/components/admin/AdminClientSelection";
import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import StepProgress from "@/components/StepProgress";
import type { TeamBuilderRow } from "@/types/teamBuilder";
import { useToast } from "@/providers/ToastProvider";
import { APP_ROUTES } from "@/utils/app_routes";
import { useProjectProgress } from "@/utils/useProjectProgress";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import { updateProjectService } from "@/services/addProjectDetails";
import { getProjectService } from "@/services/getProject";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

const TeamCreation = dynamic(
  () => import("@/components/specific/teambuilder/TeamCreation"),
  { ssr: false }
);
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

const adminProjectSteps = [
  {
    number: 1,
    title: "Client",
    description: "Choose account",
    icon: <BusinessRoundedIcon fontSize="small" />,
  },
  {
    number: 2,
    title: "Shortlist",
    description: "Select consultants",
    icon: <Groups2RoundedIcon fontSize="small" />,
  },
  {
    number: 3,
    title: "Confirmation",
    description: "Interview & roles",
    icon: <HowToRegRoundedIcon fontSize="small" />,
  },
  {
    number: 4,
    title: "Project",
    description: "Details & milestones",
    icon: <AssignmentRoundedIcon fontSize="small" />,
  },
  {
    number: 5,
    title: "Payment",
    description: "Review billing",
    icon: <CreditCardRoundedIcon fontSize="small" />,
  },
];

const mapAdminClient = (item: any): AdminProjectClient => {
  const user = item?.user ?? {};
  const location = [item?.city ?? user?.city, item?.country ?? user?.country]
    .filter(Boolean)
    .join(", ");

  return {
    id: String(item?.id ?? user?.id ?? ""),
    name:
      item?.company_name ??
      item?.username ??
      item?.name ??
      user?.username ??
      "Unnamed client",
    email: item?.email ?? user?.email ?? "No email available",
    phone: item?.phone ?? user?.phone,
    location,
    activeProjects: Number(item?.active_count ?? item?.activeprojects ?? 0),
    completedProjects: Number(
      item?.completed_count ?? item?.completedprojects ?? 0
    ),
  };
};

function AdminProjectBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateProjectStep } = useProjectProgress();
  const { toast } = useToast();
  const queryClientId = searchParams.get("clientId");
  const queryProjectId = searchParams.get("projectId");
  const parsedStep = Number(searchParams.get("step") ?? 1);
  const initialStep = queryClientId
    ? Math.max(1, Math.min(5, Number.isFinite(parsedStep) ? parsedStep : 1))
    : 1;

  const [activeStep, setActiveStep] = useState(initialStep);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    queryClientId
  );
  const [projectId, setProjectId] = useState<string | null>(queryProjectId);
  const [teamRows, setTeamRows] = useState<TeamBuilderRow[]>([]);
  const [selectedConsultantIds, setSelectedConsultantIds] = useState<string[]>(
    []
  );
  const [isChangingClient, setIsChangingClient] = useState(false);
  const changingClientRef = useRef(false);
  const lastSavedStepRef = useRef<number | null>(null);
  const { data, isLoading, error } = useAdminClients("active");

  const clients = useMemo(
    () => (data?.data ?? []).map(mapAdminClient).filter((client) => client.id),
    [data]
  );

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId]
  );

  useEffect(() => {
    if (!selectedClientId && activeStep !== 1) setActiveStep(1);
  }, [activeStep, selectedClientId]);

  useEffect(() => {
    if (activeStep >= 3 && !projectId) setActiveStep(2);
  }, [activeStep, projectId]);

  useEffect(() => {
    if (!projectId) return;
    const clientFlowStep = Math.max(1, activeStep - 1);
    if (lastSavedStepRef.current === clientFlowStep) return;
    lastSavedStepRef.current = clientFlowStep;
    updateProjectStep(projectId, clientFlowStep);
  }, [activeStep, projectId, updateProjectStep]);

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("step", String(activeStep));
    if (selectedClientId) query.set("clientId", selectedClientId);
    if (projectId) query.set("projectId", projectId);

    const nextQuery = query.toString();
    if (nextQuery !== searchParams.toString()) {
      router.replace(`${APP_ROUTES.ADMIN.CREATE_PROJECT}?${nextQuery}`, {
        scroll: false,
      });
    }
  }, [activeStep, projectId, router, searchParams, selectedClientId]);

  const selectClient = async (client: AdminProjectClient) => {
    if (changingClientRef.current || client.id === selectedClientId) return;
    changingClientRef.current = true;
    setIsChangingClient(true);
    try {
      if (projectId) {
        await updateProjectService(projectId, { client_id: client.id });
        const saved = await getProjectService(projectId);
        if (String(saved.data?.client_id) !== client.id) {
          throw new Error("Client change was not saved by the backend. Please update the project API.");
        }
      }
      setSelectedClientId(client.id);
      if (!projectId) {
        setTeamRows([]);
        setSelectedConsultantIds([]);
      }
      if (projectId) toast("Project client updated.", "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not update client.", "error");
    } finally {
      changingClientRef.current = false;
      setIsChangingClient(false);
    }
  };

  const returnToClientSelection = () => {
    setActiveStep(1);
  };

  const canAccessStep = (step: number) => {
    if (isChangingClient) return false;
    if (step === 1) return true;
    if (!selectedClientId) return false;
    if (step === 2) return true;
    if (!projectId) return false;
    return true;
  };

  const goToStep = (step: number) => {
    if (changingClientRef.current || step === activeStep) return;
    if (!selectedClientId && step > 1) {
      toast("Select a client first.", "info");
      return;
    }
    if (!projectId && step > 2) {
      toast("Create the project shortlist first to open this step.", "info");
      return;
    }
    setActiveStep(step);
  };

  const currentStep = useMemo(() => {
    if (activeStep === 1) {
      return (
        <AdminClientSelection
          clients={clients}
          selectedClientId={selectedClientId}
          isLoading={isLoading}
          isSaving={isChangingClient}
          error={error?.message ?? null}
          onSelect={selectClient}
          onContinue={() => !changingClientRef.current && selectedClientId && setActiveStep(2)}
        />
      );
    }

    if (!selectedClientId) return null;

    switch (activeStep) {
      case 2:
        return (
          <TeamCreation
            clientId={selectedClientId}
            projectId={projectId}
            rows={teamRows}
            setRows={setTeamRows}
            selectedIds={selectedConsultantIds}
            setSelectedIds={setSelectedConsultantIds}
            onNext={(id) => {
              setProjectId(id);
              setActiveStep(3);
            }}
          />
        );
      case 3:
        return (
          <TeamConfirmation
            projectId={projectId}
            onDiscard={() => setActiveStep(2)}
            onNext={(id) => {
              setProjectId(id);
              setActiveStep(4);
            }}
          />
        );
      case 4:
        return (
          <TeamProjects
            projectId={projectId}
            clientId={selectedClientId}
            clientName={selectedClient?.name}
            showTasks={false}
            onBack={() => setActiveStep(3)}
            onNext={(id) => {
              setProjectId(id);
              setActiveStep(5);
            }}
          />
        );
      case 5:
        return projectId ? (
          <TeamPayments
            projectId={projectId}
            onDiscard={() => setActiveStep(4)}
            completionRoute={APP_ROUTES.ADMIN.PROJECTS}
          />
        ) : null;
      default:
        return null;
    }
  }, [
    activeStep,
    clients,
    error,
    isLoading,
    isChangingClient,
    projectId,
    selectedClient,
    selectedClientId,
    selectedConsultantIds,
    teamRows,
  ]);

  const needsClientResolution =
    activeStep > 1 && selectedClientId && isLoading && !selectedClient;

  return (
    <Sidebar>
      <AdminPageShell
        title="Create project"
        description="Build your team, define milestones and launch your project."
        actions={
          <Stack direction="row" spacing={1}>
          {activeStep > 1 && <Button onClick={returnToClientSelection} sx={{ textTransform: "none" }}>Change client</Button>}
          <Button
            variant="outlined"
            onClick={() => router.push(APP_ROUTES.ADMIN.PROJECTS)}
          >
            Exit to projects
          </Button>
          </Stack>
        }
      >
        <StepProgress
          steps={adminProjectSteps}
          activeStep={activeStep}
          onStepClick={goToStep}
          isStepAccessible={canAccessStep}
        />

        {needsClientResolution ? (
          <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          currentStep
        )}
      </AdminPageShell>
    </Sidebar>
  );
}

export default function AdminProjectBuilderPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <CircularProgress size={32} />
        </Box>
      }
    >
      <AdminProjectBuilderContent />
    </Suspense>
  );
}
