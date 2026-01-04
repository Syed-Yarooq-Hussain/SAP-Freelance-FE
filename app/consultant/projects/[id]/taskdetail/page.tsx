"use client";

import { useGetMilestoneTasks } from "@/actions/projects/useGetMilestoneTasks";
import { useProjectDetails } from "@/actions/projects/useGetProjectDetails";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import DataTable from "@/components/DataTable";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import {
  projectStats,
  taskColumns,
  teamMembers,
} from "@/data/consultantProjectDetails";
import type { ProjectInfoData } from "@/types/projects";
import { ClientMilestoneRow, ClientTaskRow } from "@/types/teamBuilder";
import { formatYMD } from "@/utils/dateTime";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ConsultantTaskDetails() {
  const router = useRouter();
  const params = useSearchParams();
  const milestoneParam = params.get("id");
  const param = useParams();
  const projectId = param?.id as string;
  const milestoneId = Array.isArray(milestoneParam)
    ? milestoneParam[0]
    : milestoneParam;
  const [tasks, setTasks] = useState<ClientTaskRow[]>([]);
  const [milestoneData, setMilestoneData] = useState<
    ClientMilestoneRow | undefined
  >();

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

  const { mutate: loadMilestone } = useGetMilestoneTasks();
  const { mutate: loadProjectDetails } = useProjectDetails();
  const { mutate: loadMilestones } = useGetProjectMilestones();

  useEffect(() => {
    if (!projectId || !milestoneId) return;

    loadMilestones(projectId, {
      onSuccess: (res) => {
        const m = res.data?.find((x) => String(x.id) === String(milestoneId));

        if (!m) {
          setMilestoneData(undefined);
          return;
        }

        const formatted: ClientMilestoneRow = {
          id: m.id,
          name: m.name ?? "N/A",
          dependencies: "N/A",
          details: m.description ?? "N/A",
          end_date: formatYMD(m.due_date) || "N/A",
          start_date: formatYMD(m.start_date) || "N/A",
          status: m.status ?? "N/A",
        };

        setMilestoneData(formatted);
      },
    });
  }, [projectId, milestoneId, loadMilestones]);

  const fetchTasks = useCallback(() => {
    if (!milestoneId) return;

    loadMilestone(milestoneId, {
      onSuccess: (res) => {
        const m = res.data;
        if (!m || !m.tasks) {
          setTasks([]);
          return;
        }

        const formatted: ClientTaskRow[] = m.tasks.map((task) => ({
          id: task.id,
          name: task.name,
          dependencies: "N/A",
          details: task.description ?? "N/A",
          deadline: "-",
          status: m.status ?? "N/A",
        }));

        setTasks(formatted);
      },
      onError: (err) => console.error("TASK API ERROR:", err),
    });
  }, [milestoneId, loadMilestone]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!projectId) return;

    loadProjectDetails(projectId, {
      onSuccess: (res) => {
        const data = res.data;

        const clientIndustry = `${data?.client?.username ?? "N/A"} - ${
          data?.company_name ?? "N/A"
        }`;

        setProjectInfo({
          name: data?.name ?? "N/A",
          clientIndustry,
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
    });
  }, [projectId, loadProjectDetails]);

  return (
    <Sidebar>
      <ProjectDetailsLayout
        stats={projectStats}
        projectInfo={projectInfo}
        teamMembers={teamMembers}
        milestoneData={milestoneData}
        showMilestone={true}
      >
        <DataTable
          title="Tasks"
          columns={taskColumns}
          rows={tasks}
          pageSize={10}
          showBackButton
          onBackClick={() => router.back()}
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
