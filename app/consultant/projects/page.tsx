"use client";

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
  const [consultantProjectRows, setProjectRows] = useState<IConsultantProjectRow[]>([]);
  const { mutate: loadProjects } = useConsultantProjects();

  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const mapped: IConsultantProjectRow[] =
          res.data?.map((item: IConsultantProject) => ({
            id: Number(item.project_id),
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
        stats={consultantProjectStats}
        columns={consultantProjectColumns}
        rows={consultantProjectRows}
      />
    </Sidebar>
  );
}
