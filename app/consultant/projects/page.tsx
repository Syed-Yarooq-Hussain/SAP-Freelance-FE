"use client";

import { useConsultantStats } from "@/actions/consultants/useConsultantStats";
import { useConsultantProjects } from "@/actions/projects/useConsultantProjects";
import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import {
  consultantProjectColumns,
  consultantProjectStats,
} from "@/data/consultantProject";
import { IConsultantProject, IConsultantProjectRow } from "@/types/consultant";
import { formatYMD } from "@/utils/dateTime";
import { useCallback, useEffect, useState } from "react";

export default function ConsultantProjectPage() {
  const [consultantProjectRows, setProjectRows] = useState<
    IConsultantProjectRow[]
  >([]);
  const { mutate: loadProjects } = useConsultantProjects();
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

  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const mapped: IConsultantProjectRow[] =
          res.data?.map((item: IConsultantProject) => ({
            id: Number(item.project_id),
            projectId: String(item.project_id),
            project_name: item.project_name,
            client_name: item.client_name,
            modules: item.modules?.length ? item.modules.join(", ") : "N/A",
            duration: item.duration !== null ? String(item.duration) : "N/A",
            start_date: formatYMD(item.start_date) ?? "N/A",
            status: item.project_status,
          })) ?? [];

        setProjectRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Sidebar>
      <Project
        title=""
        stats={projectStats}
        columns={consultantProjectColumns}
        rows={consultantProjectRows}
      />
    </Sidebar>
  );
}
