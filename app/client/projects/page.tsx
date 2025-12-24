"use client";

import { useClientProjects } from "@/actions/projects/useClientProjects";
import Sidebar from "@/components/Sidebar";
import Project from "@/components/specific/Project";
import { clientProjectColumns, clientProjectStats } from "@/data/clientProject";
import type { ClientProjectRow, IClientProjectDTO } from "@/types/client";
import { useCallback, useEffect, useState } from "react";

export default function ClientProjectPage() {
  const [projectRows, setProjectRows] = useState<ClientProjectRow[]>([]);
  const { mutate: loadProjects } = useClientProjects();

  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        const mapped: ClientProjectRow[] =
          res.data?.map((item: IClientProjectDTO, index) => ({
            id: `${item.id}-${index}`,
            projectId: String(item.id),
            name: item.name,
            members: item.members,
            duration: item.projectDetails?.duration
              ? `${item.projectDetails.duration} months`
              : "N/A",
            spend: "N/A",
            startdate: item.projectDetails?.start_date
              ? item.projectDetails.start_date.split("T")[0]
              : "N/A",
            estimated: "N/A",
            status: item.status,
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
        title="Projects"
        stats={clientProjectStats}
        columns={clientProjectColumns}
        rows={projectRows}
      />
    </Sidebar>
  );
}
