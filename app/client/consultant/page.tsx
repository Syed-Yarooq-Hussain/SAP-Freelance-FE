"use client";

import { useClientConsultants } from "@/actions/consultants/useClientConsultants";
import { useClientProjects } from "@/actions/projects/useClientProjects";
import Sidebar from "@/components/Sidebar";
import Consultant from "@/components/specific/Consultant";
import { clientConsultantColumns } from "@/data/clientConsultant";
import { ClientConsultantRow, IClientProjectDTO } from "@/types/client";
import { ClientConsultantDTO } from "@/types/teamBuilder";
import { useCallback, useEffect, useState } from "react";

export default function ClientConsultantPage() {
  const [consultantRows, setConsultantRows] = useState<ClientConsultantRow[]>(
    []
  );
  const [projectList, setProjectList] = useState<IClientProjectDTO[]>([]);
  const { mutate: loadConsultants } = useClientConsultants();
  const { mutate: loadProjects } = useClientProjects();
  const fetchConsultants = useCallback(() => {
    loadConsultants(undefined, {
      onSuccess: (res) => {
        const apiData = res.data as ClientConsultantDTO[];

        const mapped: ClientConsultantRow[] = apiData.map(
          (item: ClientConsultantDTO, index: number) => ({
            id: item.id,
            avatar: `/img/u${((index % 5) + 1).toString()}.png`,
            name: item.name ?? "N/A",
            coremodules: item.modules?.core || "N/A",
            othersmodules: item.modules?.others || "N/A",
            experience: item.experience ? `${item.experience} Years` : "N/A",
            hourlyRate: item.rate ? `$${item.rate}/hour` : "N/A",
            projectName: "N/A",
            meeting: "Send Invite",
          })
        );

        setConsultantRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadConsultants]);

  const fetchProjects = useCallback(() => {
    loadProjects(undefined, {
      onSuccess: (res) => {
        setProjectList(res.data ?? []);
      },
      onError: (err) => console.error(err),
    });
  }, [loadProjects]);

  useEffect(() => {
    fetchConsultants();
    fetchProjects();
  }, [fetchConsultants, fetchProjects]);

  return (
    <Sidebar>
      <Consultant
        title="Consultant"
        columns={clientConsultantColumns}
        rows={consultantRows}
        showMeetingActions
        showFilters
        projectId={projectList[0]?.id ?? null}
      />
    </Sidebar>
  );
}
