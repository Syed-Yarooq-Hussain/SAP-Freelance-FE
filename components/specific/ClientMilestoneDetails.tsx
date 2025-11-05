"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import {
  dependencyOptions,
  milestoneColumns,
  milestoneRows,
  projectInfoData,
  projectStats,
  teamMembers,
} from "@/data/clientDetails";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectDetailsLayout from "./ProjectDetailsLayout";

export default function ClientMilestoneDetails() {
  const router = useRouter();
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

  return (
    <ProjectDetailsLayout
      stats={projectStats}
      projectInfo={projectInfoData}
      teamMembers={teamMembers}
    >
      <DataTable
        title="Milestones"
        columns={milestoneColumns}
        rows={milestoneRows}
        pageSize={10}
        showBackButton
        onBackClick={() => router.back()}
        onRowClick={(params) =>
          router.push(`/client/projects/${params.id}/taskdetail`)
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
            label: "Milestone Name",
            value: milestoneData.name,
            onChange: (v) => handleFieldChange("name", v as string),
            placeholder: "Enter milestone name",
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
            label: "Description",
            value: milestoneData.description,
            onChange: (v) => handleFieldChange("description", v as string),
            placeholder: "Enter milestone description",
          },
        ]}
      />
    </ProjectDetailsLayout>
  );
}
