"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import {
  assigneeOptions,
  milestoneOptions,
  projectInfoData,
  projectStats,
  taskColumns,
  taskRows,
  teamMembers,
} from "@/data/clientDetails";
import { APP_ROUTES } from "@/utils/app_routes";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import DynamicPopup from "../Popup";

export default function ClientTaskDetails() {
  const router = useRouter();
  const params = useParams();
  const [openPopup, setOpenPopup] = useState(false);

  const [taskData, setTaskData] = useState({
    name: "",
    assignee: "",
    description: "",
    milestone: "",
  });

  const handleFieldChange = (field: keyof typeof taskData, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setTaskData({
      name: "",
      assignee: "",
      description: "",
      milestone: "",
    });
  };

  const isFormValid = Object.values(taskData).every((val) => val.trim() !== "");

  const handleAddTask = () => {
    console.log("Task added:", taskData);
    handleClosePopup();
  };

  const milestoneData = {
    name: "Blueprint Documentation",
    dependencies: "Scope and Objectives",
    details: "One of the cool things about this font generator is that you...",
    deadline: "15.09.2025",
    status: "In progress",
  };

  return (
    <ProjectDetailsLayout
      stats={projectStats}
      projectInfo={projectInfoData}
      teamMembers={teamMembers}
      showMilestone
      milestoneData={milestoneData}
    >
      <DataTable
        title="Tasks"
        columns={taskColumns}
        rows={taskRows}
        pageSize={10}
        showBackButton
        onBackClick={() =>
          router.push(`${APP_ROUTES.CLIENT.PROJECTS}/${params.id}`)
        }
        actionButton={
          <AppButton
            label="Add Task"
            colorKey="BLUE"
            width={180}
            onClick={() => setOpenPopup(true)}
          />
        }
      />

      <DynamicPopup
        open={openPopup}
        onClose={handleClosePopup}
        title="Add Task"
        buttonText="Add"
        onSubmit={handleAddTask}
        disableSubmit={!isFormValid}
        fields={[
          {
            id: "taskName",
            label: "",
            value: taskData.name,
            onChange: (v) => handleFieldChange("name", v as string),
            placeholder: "Select name",
          },
          {
            id: "assignee",
            label: "Assignee",
            value: taskData.assignee,
            onChange: (v) => handleFieldChange("assignee", v as string),
            options: assigneeOptions,
            placeholder: "Select Consultant",
          },
          {
            id: "description",
            label: "",
            value: taskData.description,
            onChange: (v) => handleFieldChange("description", v as string),
            placeholder: "Select document",
          },
          {
            id: "milestone",
            label: "Milestone",
            value: taskData.milestone,
            onChange: (v) => handleFieldChange("milestone", v as string),
            options: milestoneOptions,
            placeholder: "Select milestone",
          },
        ]}
      />
    </ProjectDetailsLayout>
  );
}
