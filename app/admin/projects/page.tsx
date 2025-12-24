"use client";

import { useAdminProjects } from "@/actions/admin/useAdminProjects";
import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import { adminProjectColumns } from "@/data/adminProject";
import { IAdminProject } from "@/types/projects";
import { formatYMD } from "@/utils/dateTime";

export default function AdminProjectPage() {
  const { data } = useAdminProjects();
  const mapAdminProjectsToRows = (data: IAdminProject[]) =>
    data.map((project, index) => ({
      id: `admin-project-${project.id}-${index}`,
      projectId: project.id,
      name: project.name,
      client_name: project.client_name,
      coremodules: project.modules?.core || "N/A",
      othersmodules: project.modules?.others || "N/A",
      duration: `${project.duration} mins`,
      start_date: formatYMD(project.start_date),
      status: project.status,
    }));

  const rows = data?.data ? mapAdminProjectsToRows(data.data) : [];

  return (
    <Sidebar>
      <Project
        title="Created Projects"
        stats={[]}
        columns={adminProjectColumns}
        rows={rows}
      />
    </Sidebar>
  );
}
