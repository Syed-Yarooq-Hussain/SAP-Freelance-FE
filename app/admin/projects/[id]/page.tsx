"use client";

import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import { useProjectDetails } from "@/actions/projects/useGetProjectDetails";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import AdminPageShell from "@/components/admin/AdminPageShell";
import DataTable from "@/components/DataTable";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import { CONSULTANT_STATUS } from "@/constants/status";
import type { ProjectInfoData, TeamMember } from "@/types/projects";
import type { IProjectConsultant, IMilestone } from "@/types/teamBuilder";
import { APP_ROUTES } from "@/utils/app_routes";
import { formatYMD } from "@/utils/dateTime";
import { formatHourlyRate } from "@/utils/rates";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AdminMilestoneRow = {
  id: string | number;
  name: string;
  details: string;
  startDate: string;
  dueDate: string;
  status: string;
  tasks: number;
};

type AdminProjectConsultantRow = {
  id: string | number;
  name: string;
  role: string;
  status: string;
  baseRate: number | null;
  margin: number | null;
  finalRate: number;
  currency: string;
};

const EMPTY_PROJECT_INFO: ProjectInfoData = {
  name: "Loading...",
  clientIndustry: "N/A",
  module: "N/A",
  functionalScope: "N/A",
  technicalScope: "N/A",
  outOfScope: "N/A",
  start_date: "N/A",
  duration: "N/A",
  status: "N/A",
};

const consultantColumns: GridColDef<AdminProjectConsultantRow>[] = [
  { field: "name", headerName: "Consultant", minWidth: 170, flex: 1.3 },
  { field: "role", headerName: "Role", minWidth: 130, flex: 1 },
  {
    field: "status",
    headerName: "Status",
    minWidth: 120,
    flex: 0.8,
    renderCell: (params) => <Chip size="small" label={params.value} />,
  },
  {
    field: "baseRate",
    headerName: "Base Rate",
    minWidth: 120,
    flex: 0.9,
    renderCell: (params) =>
      formatHourlyRate(params.row.baseRate, params.row.currency),
  },
  {
    field: "margin",
    headerName: "Margin",
    minWidth: 100,
    flex: 0.7,
    renderCell: (params) =>
      params.value === null || params.value === undefined
        ? "N/A"
        : `${params.value}%`,
  },
  {
    field: "finalRate",
    headerName: "Final Client Rate",
    minWidth: 150,
    flex: 1,
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 700 }}>
        {formatHourlyRate(params.value, params.row.currency)}/hr
      </Typography>
    ),
  },
];

const milestoneColumns: GridColDef<AdminMilestoneRow>[] = [
  { field: "name", headerName: "Milestone", minWidth: 170, flex: 1.2 },
  { field: "details", headerName: "Details", minWidth: 220, flex: 1.7 },
  { field: "startDate", headerName: "Start Date", minWidth: 110, flex: 0.8 },
  { field: "dueDate", headerName: "Due Date", minWidth: 110, flex: 0.8 },
  { field: "tasks", headerName: "Tasks", minWidth: 80, flex: 0.5 },
  {
    field: "status",
    headerName: "Status",
    minWidth: 110,
    flex: 0.7,
    renderCell: (params) => <Chip size="small" label={params.value} />,
  },
];

export default function AdminProjectDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params?.id;
  const projectDetails = useProjectDetails();
  const projectMilestones = useGetProjectMilestones();
  const projectConsultants = useGetProjectConsultants();
  const [projectInfo, setProjectInfo] = useState(EMPTY_PROJECT_INFO);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [consultants, setConsultants] = useState<AdminProjectConsultantRow[]>([]);
  const [milestones, setMilestones] = useState<AdminMilestoneRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    projectDetails.mutate(projectId, {
      onSuccess: (response) => {
        const project = response.data;
        const details = (project?.projectDetails ?? {}) as Record<string, unknown>;
        const modules = details.modules as { core?: string; others?: string } | undefined;
        setProjectInfo({
          name: project?.name ?? "N/A",
          clientIndustry: [
            project?.client?.username ?? project?.client?.email,
            details.industry,
          ].filter(Boolean).join(" · ") || "N/A",
          module: [modules?.core, modules?.others].filter(Boolean).join(", ") || "N/A",
          functionalScope: String(details.functional_scope ?? "N/A"),
          technicalScope: String(details.technical_scope ?? "N/A"),
          outOfScope: String(details.out_of_scope ?? "N/A"),
          start_date: formatYMD(String(details.start_date ?? "")) || "N/A",
          duration: details.duration ? `${details.duration} months` : "N/A",
          status: project?.status ?? "N/A",
        });
      },
      onError: (requestError) => setError(requestError.message),
    });

    projectMilestones.mutate(projectId, {
      onSuccess: (response) => {
        setMilestones(
          (response.data ?? []).map((milestone: IMilestone) => ({
            id: milestone.id,
            name: milestone.name,
            details: milestone.description ?? "N/A",
            startDate: formatYMD(milestone.start_date),
            dueDate: formatYMD(milestone.due_date),
            status: milestone.status ?? "N/A",
            tasks: milestone.tasks?.length ?? 0,
          }))
        );
      },
      onError: (requestError) => setError(requestError.message),
    });

    projectConsultants.mutate(
      {
        projectId,
        statuses: Object.values(CONSULTANT_STATUS),
      },
      {
        onSuccess: (response) => {
          const list = response.data ?? [];
          setConsultants(
            list.map((consultant: IProjectConsultant) => ({
              id: consultant.consultant_id,
              name: consultant.name || `Consultant #${consultant.consultant_id}`,
              role: consultant.role ?? "Not assigned",
              status: consultant.status,
              baseRate: consultant.base_rate ?? null,
              margin: consultant.profit_margin_percentage ?? null,
              finalRate: consultant.rate,
              currency: consultant.currency ?? "USD",
            }))
          );
          setTeamMembers(
            list.map((consultant, index) => ({
              name: consultant.name || `Consultant #${consultant.consultant_id}`,
              role: consultant.role ?? consultant.status,
              avatar: `/img/u${(index % 5) + 1}.png`,
            }))
          );
        },
        onError: (requestError) => setError(requestError.message),
      }
    );
  }, [projectId]);

  const isLoading =
    projectDetails.isPending ||
    projectMilestones.isPending ||
    projectConsultants.isPending;

  const summary = useMemo(
    () => `${consultants.length} consultant${consultants.length === 1 ? "" : "s"} · ${milestones.length} milestone${milestones.length === 1 ? "" : "s"}`,
    [consultants.length, milestones.length]
  );

  return (
    <Sidebar>
      <AdminPageShell
        title={projectInfo.name === "Loading..." ? "Project details" : projectInfo.name}
        description={`Admin project overview · ${summary}`}
        actions={
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => router.push(APP_ROUTES.ADMIN.PROJECTS)}
          >
            Back to projects
          </Button>
        }
      >
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {isLoading && projectInfo.name === "Loading..." ? (
          <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
            <Stack alignItems="center" spacing={1.5}>
              <CircularProgress size={32} />
              <Typography color="text.secondary">Loading project...</Typography>
            </Stack>
          </Box>
        ) : (
          <ProjectDetailsLayout
            projectInfo={projectInfo}
            teamMembers={teamMembers}
          >
            <Stack spacing={3}>
              <DataTable
                title="Project Consultants"
                columns={consultantColumns}
                rows={consultants}
                pageSize={10}
                rowClickable={false}
                noResultText="No consultants are attached to this project."
              />
              <DataTable
                title="Milestones"
                columns={milestoneColumns}
                rows={milestones}
                pageSize={10}
                rowClickable={false}
                noResultText="No milestones have been created for this project."
              />
            </Stack>
          </ProjectDetailsLayout>
        )}
      </AdminPageShell>
    </Sidebar>
  );
}
