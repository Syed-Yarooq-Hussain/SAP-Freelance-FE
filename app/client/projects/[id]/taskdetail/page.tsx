"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";

import {
  dependencyOptions,
  projectInfoData,
  projectStats,
  taskColumns,
  teamMembers,
} from "@/data/clientProjectDetails";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useGetMilestoneTasks } from "@/actions/projects/useGetMilestoneTasks";
import { ClientTaskRow } from "@/types/teamBuilder";

export default function ClientTaskDetails() {
  const router = useRouter();
  const params = useSearchParams();
  const milestoneParam = params.get("id");
  const milestoneId = Array.isArray(milestoneParam)
    ? milestoneParam[0]
    : milestoneParam;
  const [tasks, setTasks] = useState<ClientTaskRow[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [taskData, setTaskData] = useState({
    name: "",
    dependencies: "",
    endDate: "",
    description: "",
  });
  const { mutate: loadMilestone } = useGetMilestoneTasks();
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

  const handleFieldChange = (field: keyof typeof taskData, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setTaskData({
      name: "",
      dependencies: "",
      endDate: "",
      description: "",
    });
  };

  const isFormValid = Object.values(taskData).every((val) => val.trim() !== "");

  const handleAddTask = () => {
    console.log("Task added:", taskData);
    handleClosePopup();
  };

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
          rows={tasks}
          pageSize={10}
          showBackButton
          onBackClick={() => router.back()}
          actionButton={
            <AppButton
              label="Add Task"
              colorKey="BLUE"
              width={150}
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
              placeholder: "Enter task name",
              onChange: (v) => handleFieldChange("name", v as string),
            },
            {
              id: "dependencies",
              label: "Select Dependency Document",
              value: taskData.dependencies,
              onChange: (v) => handleFieldChange("dependencies", v as string),
              options: dependencyOptions,
            },
            {
              id: "endDate",
              label: "End Date",
              type: "date",
              value: taskData.endDate,
              onChange: (v) => handleFieldChange("endDate", v as string),
            },
            {
              id: "description",
              label: "",
              value: taskData.description,
              placeholder: "Enter task description",
              onChange: (v) => handleFieldChange("description", v as string),
            },
          ]}
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
