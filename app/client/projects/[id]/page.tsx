"use client";

import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import {
  dependencyOptions,
  milestoneColumns,
  projectInfoData,
  projectStats,
  teamMembers,
} from "@/data/clientProjectDetails";
import type { ClientMilestoneRow, IMilestone } from "@/types/teamBuilder";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [milestones, setMilestones] = useState<ClientMilestoneRow[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [milestoneData, setMilestoneData] = useState({
    name: "",
    dependencies: "",
    endDate: "",
    description: "",
  });

  const handleFieldChange = (
    field: keyof typeof milestoneData,
    value: string
  ) => {
    setMilestoneData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setMilestoneData({
      name: "",
      dependencies: "",
      endDate: "",
      description: "",
    });
  };

  const isFormValid = Object.values(milestoneData).every(
    (val) => val.trim() !== ""
  );

  const handleAddMilestone = () => {
    console.log("Milestone added:", milestoneData);
    handleClosePopup();
  };

  const { mutate: loadMilestones } = useGetProjectMilestones();
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
          deadline: m.due_date ? m.due_date.split("T")[0] : "N/A",
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

  return (
    <Sidebar>
      <ProjectDetailsLayout
        stats={projectStats}
        projectInfo={projectInfoData}
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
              `/client/projects/${projectId}/taskdetail?id=${params.id}`
            )
          }
          actionButton={
            <AppButton
              label="Add Milestone"
              colorKey="BLUE"
              width={180}
              onClick={() => setOpenPopup(true)}
            />
          }
        />

        <DynamicPopup
          open={openPopup}
          onClose={handleClosePopup}
          title="Add Milestone"
          buttonText="Add"
          onSubmit={handleAddMilestone}
          disableSubmit={!isFormValid}
          fields={[
            {
              id: "milestoneName",
              label: "",
              value: milestoneData.name,
              placeholder: "Enter milestone name",
              onChange: (v) => handleFieldChange("name", v as string),
            },
            {
              id: "dependencies",
              label: "Select Dependency Document",
              value: milestoneData.dependencies,
              onChange: (v) => handleFieldChange("dependencies", v as string),
              options: dependencyOptions,
            },
            {
              id: "endDate",
              label: "End Date",
              type: "date",
              value: milestoneData.endDate,
              onChange: (v) => handleFieldChange("endDate", v as string),
            },
            {
              id: "description",
              label: "",
              value: milestoneData.description,
              placeholder: "Enter milestone description",
              onChange: (v) => handleFieldChange("description", v as string),
            },
          ]}
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
