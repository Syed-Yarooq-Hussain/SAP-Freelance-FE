"use client";

import DataTable from "@/components/DataTable";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import {
  projectInfoData,
  projectStats,
  taskColumns,
  taskRows,
  teamMembers,
} from "@/data/consultantProjectDetails";
import { useRouter } from "next/navigation";

export default function ConsultantProjectDetails() {
  const router = useRouter();

  return (
    <Sidebar>
      <ProjectDetailsLayout
        stats={projectStats}
        projectInfo={projectInfoData}
        teamMembers={teamMembers}
      >
        <DataTable
          title="Tasks"
          columns={taskColumns}
          rows={taskRows}
          pageSize={10}
          showBackButton
          onBackClick={() => router.back()}
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
