"use client";

import { useConsultantStats } from "@/actions/consultants/useConsultantStats";
import { useProjectDetails } from "@/actions/projects/useGetProjectDetails";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import DataTable from "@/components/DataTable";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import { consultantProjectStats } from "@/data/consultantProject";
import { milestoneColumns, teamMembers } from "@/data/consultantProjectDetails";
import { ProjectInfoData } from "@/types/projects";
import { ClientMilestoneRow, IMilestone } from "@/types/teamBuilder";
import { APP_ROUTES } from "@/utils/app_routes";
import { formatYMD } from "@/utils/dateTime";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ConsultantProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [milestones, setMilestones] = useState<ClientMilestoneRow[]>([]);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoData>({
    name: "",
    clientIndustry: "",
    module: "",
    functionalScope: "",
    technicalScope: "",
    outOfScope: "",
    start_date: "",
    duration: "",
    status: "",
  });

  const { mutate: loadMilestones } = useGetProjectMilestones();
  const { data: statsRes, isLoading: statsLoading } = useConsultantStats();
  const projectStatsData = statsRes?.data?.projects_stats;

  const projectStats = consultantProjectStats.map((stat, index) => {
    if (index === 0) {
      return {
        ...stat,
        subtitle: projectStatsData?.current?.project ?? "-",
        extra: projectStatsData?.current?.employeer,
        description: projectStatsData?.current?.project_info,
        loading: statsLoading,
      };
    }

    if (index === 1) {
      return {
        ...stat,
        subtitle: projectStatsData?.upcoming?.project ?? "-",
        extra: projectStatsData?.upcoming?.employeer,
        description: projectStatsData?.upcoming?.project_info,
        loading: statsLoading,
      };
    }

    if (index === 2) {
      return {
        ...stat,
        subtitle: projectStatsData?.task?.total ?? 0,
        description: `${projectStatsData?.task?.pending ?? 0} pending`,
        loading: statsLoading,
      };
    }

    return stat;
  });

  const fetchMilestones = useCallback(() => {
    if (!projectId) return;

    loadMilestones(projectId, {
      onSuccess: (res) => {
        const list = res.data ?? [];

        const formatted = list.map((m: IMilestone) => ({
          id: m.id,
          name: m.name,
          dependencies: "N/A",
          details: m.description ?? "N/A",
          end_date: formatYMD(m.due_date) || "N/A",
          start_date: formatYMD(m.start_date) || "N/A",
          status: m.status ?? "N/A",
        }));

        setMilestones(formatted);
      },
      onError: (err) => console.error(err),
    });
  }, [projectId, loadMilestones]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const { mutate: loadProjectDetails } = useProjectDetails();

  useEffect(() => {
    if (!projectId) return;

    loadProjectDetails(projectId, {
      onSuccess: (res) => {
        const data = res.data;

        setProjectInfo({
          name: data?.name ?? "N/A",
          clientIndustry: `${data?.client?.username ?? "N/A"} - ${
            data?.company_name ?? "N/A"
          }`,
          module: "N/A",
          functionalScope: "N/A",
          technicalScope: "N/A",
          outOfScope: "N/A",
          start_date: formatYMD(data?.projectDetails?.start_date ?? ""),
          duration: data?.projectDetails?.duration
            ? `${data.projectDetails.duration} months`
            : "N/A",
          status: data?.status ?? "N/A",
        });
      },
      onError: (err) => console.error("Failed to load project details", err),
    });
  }, [projectId, loadProjectDetails]);

  return (
    <Sidebar>
      <ProjectDetailsLayout
        stats={projectStats}
        projectInfo={projectInfo}
        teamMembers={teamMembers}
      >
        <DataTable
          title="Milestones"
          columns={milestoneColumns}
          rows={milestones}
          pageSize={10}
          showBackButton
          onBackClick={() => router.back()}
          onRowClick={(params) =>
            router.push(
              `${APP_ROUTES.CONSULTANT.PROJECTS}/${projectId}/taskdetail?id=${params.id}`
            )
          }
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
