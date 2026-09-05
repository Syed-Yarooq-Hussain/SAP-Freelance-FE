"use client";

import { useAdminProjects } from "@/actions/admin/useAdminProjects";
import AdminPageShell from "@/components/admin/AdminPageShell";
import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import { getAdminProjectColumns } from "@/data/adminProject";
import type { AdminProjectTableRow, IAdminProject } from "@/types/projects";
import { formatYMD } from "@/utils/dateTime";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/app_routes";
import { useMemo } from "react";
import { useCallback } from "react";
import { fetchProjectDetails } from "@/services/projects";
import { useToast } from "@/providers/ToastProvider";
import {
  getAdminProjectResumeStep,
  isProjectSetupStatus,
} from "@/utils/adminProjectNavigation";

export default function AdminProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data } = useAdminProjects();
  const mapAdminProjectsToRows = (data: IAdminProject[]): AdminProjectTableRow[] =>
    data.map((project, index) => ({
      id: `admin-project-${project.id}-${index}`,
      projectId: project.id,
      clientId: project.client_id,
      projectStep: project.step,
      name: project.name,
      client_name: project.client_name,
      coremodules: project.modules?.core || "N/A",
      othersmodules: project.modules?.others || "N/A",
      duration: `${project.duration} mins`,
      start_date: formatYMD(project.start_date),
      status: project.status,
    }));

  const openProject = useCallback(
    async (project: AdminProjectTableRow) => {
      if (!isProjectSetupStatus(project.status)) {
        router.push(`${APP_ROUTES.ADMIN.PROJECTS}/${project.projectId}`);
        return;
      }

      try {
        let clientId = project.clientId;
        if (!clientId) {
          const response = await fetchProjectDetails(project.projectId);
          clientId = response.data?.client_id;
        }

        if (!clientId) {
          toast("This project's client could not be resolved.", "error");
          return;
        }

        const query = new URLSearchParams({
          clientId: String(clientId),
          projectId: String(project.projectId),
          step: String(
            getAdminProjectResumeStep(project.projectId, project.projectStep)
          ),
        });
        router.push(`${APP_ROUTES.ADMIN.CREATE_PROJECT}?${query.toString()}`);
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Failed to resume project setup.",
          "error"
        );
      }
    },
    [router, toast]
  );

  const columns = useMemo(
    () => getAdminProjectColumns(openProject),
    [openProject]
  );

  const rows = data?.data ? mapAdminProjectsToRows(data.data) : [];

  return (
    <Sidebar>
      <AdminPageShell
        title="Projects"
        description="Track projects created across the platform."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => router.push(APP_ROUTES.ADMIN.CREATE_PROJECT)}
            sx={{ bgcolor: "#005C8A" }}
          >
            Create for client
          </Button>
        }
      >
        <Project
          title="Created Projects"
          stats={[]}
          columns={columns}
          rows={rows}
          onProjectClick={openProject}
        />
      </AdminPageShell>
    </Sidebar>
  );
}
