"use client";

import { useCreateTask } from "@/actions/projects/useCreateTask";
import { useGetMilestoneTasks } from "@/actions/projects/useGetMilestoneTasks";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import { useProjectDetails } from "@/actions/projects/useGetProjectDetails";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import { useUpdateTask } from "@/actions/projects/useUpdateTask";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import { CONSULTANT_STATUS } from "@/constants/status";
import { taskColumns, teamMembers } from "@/data/clientProjectDetails";
import { getTaskFormFields } from "@/forms/taskForm";
import { IOption } from "@/types/options";
import type { ProjectInfoData } from "@/types/projects";
import { ClientMilestoneRow, ClientTaskRow, ITask } from "@/types/teamBuilder";
import { formatYMD } from "@/utils/dateTime";
import { mapTaskFieldsToPopup } from "@/utils/mapFormToPopup";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientTaskDetails() {
  const router = useRouter();
  const params = useSearchParams();
  const milestoneParam = params.get("id");
  const param = useParams();
  const projectId = param?.id as string;
  const milestoneId = Array.isArray(milestoneParam)
    ? milestoneParam[0]
    : milestoneParam;
  const [tasks, setTasks] = useState<ClientTaskRow[]>([]);
  const getProjectConsultants = useGetProjectConsultants();
  const [assigneeOptions, setAssigneeOptions] = useState<IOption[]>([]);
  const { mutate: createTask } = useCreateTask();
  const [assigneesLoaded, setAssigneesLoaded] = useState(false);
  const [milestoneData, setMilestoneData] = useState<
    ClientMilestoneRow | undefined
  >();
  const { mutate: updateTask } = useUpdateTask();
  const [openPopup, setOpenPopup] = useState(false);
  const [taskData, setTaskData] = useState({
    taskName: "",
    taskEnd: "",
    taskAssignee: "",
    taskDoc: "",
    taskMilestone: "",
  });

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

  const loadAssignees = useCallback(() => {
    if (!projectId || assigneesLoaded) return;

    getProjectConsultants.mutate(
      {
        projectId,
        statuses: [
          CONSULTANT_STATUS.OFFERED,
          CONSULTANT_STATUS.HIRED,
          CONSULTANT_STATUS.REJECTED,
          CONSULTANT_STATUS.INTERVIEWED,
          CONSULTANT_STATUS.INTERVIEW_SCHEDULE,
        ],
      },
      {
        onSuccess: (res) => {
          const options: IOption[] = (res.data ?? [])
            .filter(
              (c) =>
                c.status === CONSULTANT_STATUS.OFFERED ||
                c.status === CONSULTANT_STATUS.HIRED
            )
            .map((c) => ({
              label: c.name,
              value: String(c.consultant_id),
            }));

          setAssigneeOptions(options);
          setAssigneesLoaded(true);
        },
      }
    );
  }, [projectId, assigneesLoaded, getProjectConsultants]);

  const { mutate: loadMilestone } = useGetMilestoneTasks();
  const { mutate: loadProjectDetails } = useProjectDetails();
  const { mutate: loadMilestones } = useGetProjectMilestones();
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | number | null>(null);

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
          start_date: formatYMD(m.due_date) || "N/A",
          status: m.status ?? "N/A",
        };

        setMilestoneData(formatted);
      },
    });
  }, [projectId, milestoneId, loadMilestones]);

  const milestoneOption = milestoneData
    ? [{ value: String(milestoneData.id), label: milestoneData.name }]
    : [];

  const handleEditTask = useCallback(
    (task: ITask) => {
      if (assigneeOptions.length === 0) {
        loadAssignees();
      }

      setIsEditing(true);
      setEditTaskId(task.id);

      setTaskData({
        taskName: task.name || "",
        taskDoc: task.description || "",
        taskEnd: "",
        taskAssignee: String(task.assignee_id ?? ""),
        taskMilestone: milestoneId || "",
      });

      setOpenPopup(true);
    },
    [milestoneId, loadAssignees, assigneeOptions.length]
  );
  const fetchTasks = () => {
    if (!milestoneId) return;

    loadMilestone(milestoneId, {
      onSuccess: (res) => {
        const m = res.data;
        if (!m || !m.tasks) {
          setTasks([]);
          return;
        }

        setTasks(
          m.tasks.map((task) => ({
            id: task.id,
            name: task.name,
            dependencies: "N/A",
            details: task.description ?? "N/A",
            deadline: "-",
            status: m.status ?? "N/A",
            onEdit: () => handleEditTask(task),
            onDelete: () => console.log("DELETE TASK SOON", task.id),
          }))
        );
      },
    });
  };

  useEffect(() => {
    if (!milestoneId) return;
    fetchTasks();
  }, [milestoneId]);

  useEffect(() => {
    if (!projectId) return;

    loadProjectDetails(projectId, {
      onSuccess: (res) => {
        const data = res.data;

        const clientIndustry = `${data?.client?.username ?? "User"} - ${
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

  const handleFieldChange = (field: string, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setTaskData({
      taskName: "",
      taskEnd: "",
      taskAssignee: "",
      taskDoc: "",
      taskMilestone: "",
    });
  };

  const isFormValid =
    !!taskData.taskName && !!taskData.taskAssignee && !!taskData.taskMilestone;

  const handleSubmitTask = () => {
    if (!milestoneId || !projectId) return;

    const payload = {
      name: taskData.taskName,
      description: taskData.taskDoc,
      assignee_id: Number(taskData.taskAssignee),
      required_hours: 40,
      project_milestone_id: Number(milestoneId),
      project_id: Number(projectId),
    };

    if (isEditing && editTaskId) {
      updateTask(
        { taskId: editTaskId, body: payload },
        {
          onSuccess: () => {
            console.log("Task updated successfully");
            handleClosePopup();
            fetchTasks();
            setIsEditing(false);
            setEditTaskId(null);
          },
          onError: (err) => console.error("Update task failed:", err),
        }
      );
    } else {
      createTask(
        { milestoneId, body: payload },
        {
          onSuccess: () => {
            console.log("Task created successfully");
            handleClosePopup();
            fetchTasks();
          },
          onError: (err) => console.error("Create task failed:", err),
        }
      );
    }
  };

  return (
    <Sidebar>
      <ProjectDetailsLayout
        //stats={projectStats}
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
          actionButton={
            <AppButton
              label="Add Task"
              colorKey="BLUE"
              width={150}
              onClick={() => {
                loadAssignees();
                setOpenPopup(true);
              }}
            />
          }
        />

        <DynamicPopup
          open={openPopup}
          onClose={handleClosePopup}
          title="Add Task"
          buttonText={isEditing ? "Update" : "Add"}
          onSubmit={handleSubmitTask}
          disableSubmit={!isFormValid}
          fields={mapTaskFieldsToPopup(
            getTaskFormFields(milestoneOption, assigneeOptions),
            taskData,
            handleFieldChange
          )}
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
