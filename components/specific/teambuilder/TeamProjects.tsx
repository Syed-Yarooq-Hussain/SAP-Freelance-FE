"use client";

import { useUpdateProject } from "@/actions/projects/useaddProjectDetails";
import { useCreateMilestone } from "@/actions/projects/useCreateMilestone";
import { useCreateTask } from "@/actions/projects/useCreateTask";
import { useGetMilestoneTasks } from "@/actions/projects/useGetMilestoneTasks";
import { useGetProject } from "@/actions/projects/useGetProject";
import { useGetProjectConsultants } from "@/actions/projects/useGetProjectConsultants";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import { useUpdateMilestone } from "@/actions/projects/useUpdateMilestone";
import { useUpdateTask } from "@/actions/projects/useUpdateTask";
import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import MilestoneExpandableTable from "@/components/MilestoneExpandableTable";
import DynamicPopup from "@/components/Popup";
import { CONSULTANT_STATUS } from "@/constants/status";
import { getMilestoneFormFields } from "@/forms/milestoneForm";
import { getProjectFormFields } from "@/forms/projectForm";
import { getScopeFormFields } from "@/forms/scopeForm";
import { getTaskFormFields } from "@/forms/taskForm";
import { useToast } from "@/providers/ToastProvider";
import { IFieldConfig } from "@/types/create-form";
import { IOption } from "@/types/options";
import type { TeamProjectFormData } from "@/types/teamBuilder";
import {
  ICreateMilestonePayload,
  ICreateTaskPayload,
  IMilestone,
  ITask,
  MilestoneRow,
  TaskRow,
  TasksByMilestone,
  TeamProjectsProps,
} from "@/types/teamBuilder";
import { mapInterviewFieldsToPopup } from "@/utils/mapFormToPopup";
import { useProjectProgress } from "@/utils/useProjectProgress";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import FlagIcon from "@mui/icons-material/Flag";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATIC_TASK_DATE = "2025-10-16";

export default function TeamProjects({
  onBack,
  onNext,
  projectId,
}: TeamProjectsProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [milestoneFormKey, setMilestoneFormKey] = useState(0);
  const [taskFormKey, setTaskFormKey] = useState(0);
  const createMilestone = useCreateMilestone();
  const createTask = useCreateTask();
  const updateProject = useUpdateProject();
  const getProject = useGetProject();
  const getMilestoneTasks = useGetMilestoneTasks();
  const getProjectMilestones = useGetProjectMilestones();
  const [editingTask, setEditingTask] = useState<TaskRow | null>(null);
  const updateTask = useUpdateTask();
  const [rows, setRows] = useState<MilestoneRow[]>([]);
  const [dynamicTasks, setDynamicTasks] = useState<TasksByMilestone>({});
  const [projectData, setProjectData] = useState<any>(null);
  const getProjectConsultants = useGetProjectConsultants();
  const [assigneeOptions, setAssigneeOptions] = useState<IOption[]>([]);
  const { markStepCompleted, isStepCompleted } = useProjectProgress();
  const [step3Completed, setStep3Completed] = useState(false);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<number | null>(
    null
  );

  const updateMilestone = useUpdateMilestone();

  const [editingMilestone, setEditingMilestone] = useState<MilestoneRow | null>(
    null
  );
  const [popupKind, setPopupKind] = useState<
    "functional" | "technical" | "out" | null
  >(null);
  const [scopeData, setScopeData] = useState<Record<string, string>>({
    scopeText: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const loadAssignees = useCallback(() => {
    if (!projectId) return;

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
          const list = res.data ?? [];

          const assignees = list.filter(
            (item) =>
              item.status === CONSULTANT_STATUS.OFFERED ||
              item.status === CONSULTANT_STATUS.HIRED
          );

          const options: IOption[] = assignees.map((item) => ({
            label: item.name,
            value: String(item.consultant_id),
          }));

          setAssigneeOptions(options);
        },
      }
    );
  }, [projectId, getProjectConsultants]);

  const handleUpdateMilestone = (data: TeamProjectFormData) => {
    if (!projectId) {
      toast("Project ID missing!", "error");
      return;
    }
    if (!editingMilestone) {
      toast("No milestone selected for editing.", "error");
      return;
    }

    const payload: ICreateMilestonePayload = {
      name: data.milestoneName as string,
      description: (data.milestoneDescDoc as string) || "",
      due_date: (data.milestoneEnd as string) || "",
      start_date: (data.milestoneStart as string) || "",
      status: "active",
      required_hours: 0,
      project_id: projectId!,
    };

    updateMilestone.mutate(
      { milestoneId: editingMilestone.id, body: payload },
      {
        onSuccess: () => {
          toast("Milestone updated!", "success");

          getProjectMilestones.mutate(projectId, {
            onSuccess: (fresh) => {
              const mapped = (fresh.data ?? []).map(mapMilestoneToRow);
              setRows(mapped);
            },
          });

          setEditingMilestone(null);
          setMilestoneFormKey((k) => k + 1);
        },
        onError: (err) => toast(err.message, "error"),
      }
    );
  };

  const handleUpdateTask = (data: TeamProjectFormData) => {
    if (!editingTask) {
      toast("No task selected for editing.", "error");
      return;
    }

    const milestoneId = Number(data.taskMilestone ?? expandedMilestoneId);
    if (!milestoneId || Number.isNaN(milestoneId)) {
      toast("Invalid milestone ID", "error");
      return;
    }

    const payload = {
      name: data.taskName as string,
      description: (data.taskDoc as string) || "",
      assignee_id: Number(data.taskAssignee),
      required_hours: 40,
      project_milestone_id: milestoneId,
      project_id: Number(projectId),
    };

    updateTask.mutate(
      { taskId: editingTask.id, body: payload },
      {
        onSuccess: (res) => {
          const updated: ITask = res.data!;

          setDynamicTasks((prev) => ({
            ...prev,
            [milestoneId]: prev[milestoneId].map((t) =>
              t.id === editingTask.id
                ? {
                    id: updated.id,
                    name: updated.name,
                    description: updated.description,
                    assignees: String(updated.assignee_id ?? ""),
                    date: STATIC_TASK_DATE,
                  }
                : t
            ),
          }));

          toast("Task updated!", "success");

          setEditingTask(null);
          setTaskFormKey((k) => k + 1);
        },
        onError: (err) => toast(err.message, "error"),
      }
    );
  };

  const handleEditMilestoneClick = useCallback((row: MilestoneRow) => {
    setEditingTask(null);
    setEditingMilestone(row);
    setMilestoneFormKey((k) => k + 1);
  }, []);

  const handleEditTaskClick = (row: TaskRow) => {
    setEditingMilestone(null);
    setEditingTask(row);
    setTaskFormKey((k) => k + 1);
  };

  const mapMilestoneToRow = (m: IMilestone): MilestoneRow => ({
    id: Number(m.id),
    name: m.name,
    start_date: m.start_date?.split("T")[0] ?? "",
    due_date: m.due_date?.split("T")[0] ?? "",
    description: m.description ?? "",
    tasks: m.tasks?.length ?? 0,
  });

  const handleScopeFieldChange = (field: string, value: string) => {
    setScopeData((prev) => ({ ...prev, [field]: value }));
  };

  const scopePopupFields = useMemo(() => {
    return mapInterviewFieldsToPopup(
      getScopeFormFields(),
      scopeData,
      handleScopeFieldChange
    );
  }, [scopeData]);

  const handleSubmit = useCallback(
    (data: TeamProjectFormData) => {
      if (!projectId) {
        console.log("Project ID not available yet… retrying");
        setTimeout(() => handleSubmit(data), 200);
        return;
      }

      const body = {
        name: data.projectName,
        client_id: session?.user?.id,
        company_name: data.client,
        status: "active",
        start_date: data.startDate,
        end_date: data.endDate,
        industry: data.industry,
        duration: Number(data.duration || 0),
        cost: 25000,
        paid_amount: 125000,
      };

      updateProject.mutate(
        { projectId, body },
        {
          onSuccess: () => {
            toast("Project updated!", "success");
            console.log("CALLING getProject FOR ID →", projectId);

            getProject.mutate(projectId, {
              onSuccess: (fresh) => {
                console.log("Updated project fetched:", fresh.data);
                setProjectData(fresh.data);
                toast("Updated project loaded!", "success");
              },
              onError: (err) => toast(err.message, "error"),
            });
          },
          onError: (err) => toast(err.message, "error"),
        }
      );
    },
    [updateProject, toast, session, getProject, projectId]
  );

  useEffect(() => {
    if (!projectId) return;

    getProject.mutate(projectId, {
      onSuccess: (fresh) => {
        setProjectData(fresh.data);
      },
    });
  }, [projectId]);

  const fetchTasksForMilestone = useCallback(
    (milestoneId: number) => {
      getMilestoneTasks.mutate(milestoneId, {
        onSuccess: (res) => {
          const milestone = res.data as IMilestone | undefined;
          const tasks: ITask[] = milestone?.tasks ?? [];

          const mapped: TaskRow[] = tasks.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            assignees: String(t.assignee_id ?? ""),
            date: STATIC_TASK_DATE,
          }));

          setDynamicTasks((prev) => ({
            ...prev,
            [milestoneId]: mapped,
          }));
        },
        onError: (err: Error) => {
          toast(err.message, "error");
        },
      });
    },
    [getMilestoneTasks, toast, setDynamicTasks]
  );

  const handleExpandMilestone = (id: number | null) => {
    setExpandedMilestoneId(id);

    if (id === null) return;

    if (assigneeOptions.length === 0) {
      loadAssignees();
    }

    if (!dynamicTasks[id]) {
      fetchTasksForMilestone(id);
    }
  };

  const handleAddMilestone = (data: TeamProjectFormData) => {
    setEditingMilestone(null);

    if (!projectId) {
      toast("Project ID missing! Please complete Step 01 again.", "error");
      return;
    }

    const payload: ICreateMilestonePayload = {
      name: data.milestoneName as string,
      description: (data.milestoneDescDoc as string) || "",
      due_date: (data.milestoneEnd as string) || "",
      start_date: (data.milestoneStart as string) || "",
      status: "active",
      required_hours: 0,
      project_id: projectId!,
    };

    createMilestone.mutate(
      { projectId, body: payload },
      {
        onSuccess: (res) => {
          toast(res.message, "success");

          getProjectMilestones.mutate(projectId, {
            onSuccess: async (fresh) => {
              const updatedList = fresh.data ?? [];

              const mapped: MilestoneRow[] = updatedList.map(mapMilestoneToRow);
              setRows(mapped);
            },
            onError: (err: Error) => toast(err.message, "error"),
          });

          setMilestoneFormKey((k) => k + 1);
        },
        onError: (err: Error) => {
          toast(err.message, "error");
        },
      }
    );
  };

  const handleAddTask = (data: TeamProjectFormData) => {
    setEditingTask(null);
    if (!projectId) {
      toast("Project ID missing! Please complete Step 01 again.", "error");
      return;
    }

    const milestoneId = Number(data.taskMilestone);
    if (!milestoneId || Number.isNaN(milestoneId)) {
      toast("Please select a milestone", "error");
      return;
    }

    const assigneeId = Number(data.taskAssignee);
    const taskName = data.taskName as string | undefined;
    const taskDesc = (data.taskDoc as string) || "";

    if (!taskName) {
      toast("Task name is required", "error");
      return;
    }

    const payload: ICreateTaskPayload = {
      name: taskName,
      description: taskDesc,
      assignee_id: assigneeId,
      required_hours: 40,
      project_milestone_id: milestoneId,
      project_id: Number(projectId),
    };

    createTask.mutate(
      { milestoneId, body: payload },
      {
        onSuccess: () => {
          toast("Task created!", "success");

          setExpandedMilestoneId(milestoneId);

          getMilestoneTasks.mutate(milestoneId, {
            onSuccess: (res) => {
              const tasks = res.data?.tasks ?? [];

              const mapped = tasks.map((t) => ({
                id: t.id,
                name: t.name,
                description: t.description,
                assignees: String(t.assignee_id ?? ""),
                date: STATIC_TASK_DATE,
              }));

              setDynamicTasks((prev) => ({
                ...prev,
                [milestoneId]: mapped,
              }));

              setRows((prev) =>
                prev.map((m) =>
                  m.id === milestoneId ? { ...m, tasks: mapped.length } : m
                )
              );

              setTaskFormKey((k) => k + 1);
            },
          });
        },
        onError: (err) => toast(err.message, "error"),
      }
    );
  };

  const openPopup = (kind: "functional" | "technical" | "out") => {
    setPopupKind(kind);
    setScopeData({ scopeText: "" });
    setUploadedFile(null);
  };

  const closePopup = () => {
    setPopupKind(null);
    setScopeData({ scopeText: "" });
    setUploadedFile(null);
  };

  const saveScope = () => {
    console.log(`Saved ${popupKind} scope:`, {
      description: scopeData.scopeText.trim(),
      file: uploadedFile,
    });
    closePopup();
  };

  const popupTitle =
    popupKind === "functional"
      ? ""
      : popupKind === "technical"
      ? ""
      : popupKind === "out"
      ? ""
      : "";

  const popupDescription =
    popupKind === "functional"
      ? "Upload Functional Scope Documents OR write by yourself."
      : popupKind === "technical"
      ? "Upload Technical Scope Documents OR write by yourself."
      : popupKind === "out"
      ? "Upload Out-of-Scope Documents OR write by yourself."
      : undefined;

  const milestoneFormElements = useMemo(
    () =>
      getMilestoneFormFields().map((f) => {
        if (!editingMilestone) return f;

        if (f.name === "milestoneName") {
          return { ...f, defaultValue: editingMilestone.name };
        }
        if (f.name === "milestoneStart") {
          return { ...f, defaultValue: editingMilestone.start_date };
        }

        if (f.name === "milestoneEnd") {
          return { ...f, defaultValue: editingMilestone.due_date };
        }
        if (f.name === "milestoneDescDoc") {
          return { ...f, defaultValue: editingMilestone.description };
        }
        return f;
      }),
    [editingMilestone]
  );

  const taskFormElements = useMemo(() => {
    const selectedMilestone = rows.find((m) => m.id === expandedMilestoneId);

    return getTaskFormFields([], assigneeOptions).flatMap(
      (el): IFieldConfig[] => {
        if (el.name === "taskMilestone") {
          return [
            {
              name: "taskMilestoneLabel",
              label: "Milestone",
              type: "text",
              defaultValue: selectedMilestone?.name ?? "",
              disabled: true,
              column: { xs: 12, md: 6 },
            },
            {
              name: "taskMilestone",
              label: "Milestone",
              type: "hidden",
              hidden: true,
              defaultValue: String(expandedMilestoneId ?? ""),
            },
          ];
        }

        return [el];
      }
    );
  }, [expandedMilestoneId, rows, assigneeOptions]);

  const mappedProjectFormFields = useMemo(() => {
    if (!projectData) return getProjectFormFields();

    const details = projectData.projectDetails || {};
    const client = projectData.client || {};

    return getProjectFormFields().map((f) => {
      switch (f.name) {
        case "projectName":
          return { ...f, defaultValue: projectData.name };

        case "client":
          return {
            ...f,
            defaultValue: client.username ?? "",
            disabled: true,
          };

        case "startDate":
          return {
            ...f,
            defaultValue: details.start_date?.split("T")[0] ?? "",
          };

        case "endDate":
          return {
            ...f,
            defaultValue: details.end_date?.split("T")[0] ?? "",
          };

        case "duration":
          return {
            ...f,
            defaultValue: String(details.duration ?? ""),
          };

        default:
          return f;
      }
    });
  }, [projectData]);

  const hasAtLeastOneCompleteMilestone = useMemo(() => {
    return rows.some((m) => {
      return (
        Boolean(m.name?.trim()) &&
        Boolean(m.start_date) &&
        Boolean(m.due_date) &&
        Boolean(m.description?.trim())
      );
    });
  }, [rows]);

  const hasCompleteMilestone = useMemo(() => {
    return rows.some(
      (m) =>
        Boolean(m.name?.trim()) &&
        Boolean(m.start_date) &&
        Boolean(m.due_date) &&
        Boolean(m.description?.trim())
    );
  }, [rows]);

  useEffect(() => {
    if (!projectId) return;
    setStep3Completed(isStepCompleted(projectId, 3));
  }, [projectId]);

  useEffect(() => {
    if (projectId && hasCompleteMilestone) {
      markStepCompleted(projectId, 3);
      setStep3Completed(true);
    }
  }, [hasCompleteMilestone, projectId]);

  const canProceed = hasCompleteMilestone || step3Completed;

  const scopeCards = [
    {
      kind: "functional" as const,
      title: "Functional Scope",
      description: "Capture business requirements, process flows, and expected outcomes.",
      icon: <DescriptionIcon fontSize="small" />,
      buttonLabel: "Add Functional Scope",
    },
    {
      kind: "technical" as const,
      title: "Technical Scope",
      description: "Add systems, integrations, data needs, and technical constraints.",
      icon: <CodeIcon fontSize="small" />,
      buttonLabel: "Add Technical Scope",
    },
    {
      kind: "out" as const,
      title: "Out of Scope",
      description: "Define exclusions early so delivery expectations stay clear.",
      icon: <BlockIcon fontSize="small" />,
      buttonLabel: "Add Out of Scope",
    },
  ];

  const loadAllMilestones = useCallback(() => {
    if (!projectId) return;

    getProjectMilestones.mutate(projectId, {
      onSuccess: async (fresh) => {
        const milestones = (fresh.data ?? []) as IMilestone[];

        const mapped = milestones.map(mapMilestoneToRow);
        setRows(mapped);

        // load tasks separately (DO NOT touch rows again)
        milestones.forEach((m) => {
          getMilestoneTasks.mutate(Number(m.id), {
            onSuccess: (res) => {
              const tasks = res.data?.tasks ?? [];
              setDynamicTasks((prev) => ({
                ...prev,
                [Number(m.id)]: tasks.map((t) => ({
                  id: String(t.id),
                  name: t.name,
                  description: t.description,
                  assignees: String(t.assignee_id ?? ""),
                  date: STATIC_TASK_DATE,
                })),
              }));
            },
          });
        });
      },
    });
  }, [projectId, getProjectMilestones, getMilestoneTasks]);

  useEffect(() => {
    if (!projectId) return;

    loadAllMilestones();
  }, [projectId]);

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Basic Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirm the project information before planning delivery.
            </Typography>
          </Box>

          <Chip
            size="small"
            icon={projectData ? <CheckCircleIcon /> : undefined}
            label={projectData ? "Loaded" : "Loading"}
            color={projectData ? "success" : "default"}
            variant={projectData ? "filled" : "outlined"}
          />
        </Stack>

        {!projectData ? (
          <Typography>Loading Basic Details...</Typography>
        ) : (
          <CreateForm
            key={projectData.id}
            elements={mappedProjectFormFields}
            onSuccess={handleSubmit}
            actionsContainerProps={{
              sx: { mt: 2, justifyContent: "flex-start" },
            }}
            submitButton={{ children: "Save Basic Details" }}
          />
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Project Scope
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add scope notes or upload documents for each area.
            </Typography>
          </Box>

          <Chip size="small" label="Optional but recommended" variant="outlined" />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          {scopeCards.map((scope) => (
            <Paper
              key={scope.kind}
              elevation={0}
              sx={{
                p: 2,
                minHeight: 180,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
                transition: "border-color 0.2s, box-shadow 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 8px 24px rgba(70, 128, 255, 0.12)",
                },
              }}
            >
              <Box>
                <Stack direction="row" spacing={1.25} alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 1,
                      display: "grid",
                      placeItems: "center",
                      color: "primary.main",
                      bgcolor: "primary.main",
                      backgroundColor: "rgba(70, 128, 255, 0.1)",
                    }}
                  >
                    {scope.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {scope.title}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {scope.description}
                </Typography>
              </Box>

              <AppButton
                label={scope.buttonLabel}
                colorKey="BLUE"
                onClick={() => openPopup(scope.kind)}
                sx={{ width: "100%" }}
              />
            </Paper>
          ))}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Milestones & Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create at least one complete milestone, then expand it to add tasks.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              icon={<FlagIcon />}
              label={`${rows.length} milestone${rows.length === 1 ? "" : "s"}`}
              variant="outlined"
            />
            <Chip
              size="small"
              icon={canProceed ? <CheckCircleIcon /> : undefined}
              label={canProceed ? "Ready to continue" : "One milestone required"}
              color={canProceed ? "success" : "default"}
              variant={canProceed ? "filled" : "outlined"}
            />
          </Stack>
        </Stack>

        <MilestoneExpandableTable
          milestones={rows}
          tasksByMilestone={dynamicTasks}
          expandedMilestoneId={expandedMilestoneId}
          onExpand={handleExpandMilestone}
          onEditTask={handleEditTaskClick}
          onEditMilestone={handleEditMilestoneClick}
          onDeleteMilestone={(m) => console.log("Delete milestone", m.id)}
          taskForm={
            <CreateForm
              key={`${taskFormKey}-${expandedMilestoneId}`}
              elements={taskFormElements}
              onSuccess={editingTask ? handleUpdateTask : handleAddTask}
              actionsContainerProps={{
                sx: { mt: 2, justifyContent: "flex-start" },
              }}
              submitButton={{ children: editingTask ? "Update Task" : "Add Task" }}
            />
          }
        />

        <Box sx={{ mt: 2.5, pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {editingMilestone ? "Edit Milestone" : "Add Milestone"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Add delivery checkpoints with dates and a clear description.
          </Typography>

        <CreateForm
          key={milestoneFormKey}
          elements={milestoneFormElements}
          onSuccess={
            editingMilestone ? handleUpdateMilestone : handleAddMilestone
          }
          actionsContainerProps={{
            sx: { mt: 2, justifyContent: "flex-start" },
          }}
          submitButton={{
            children: editingMilestone ? "Update Milestone" : "Add Milestone",
          }}
        />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: canProceed ? "success.main" : "text.secondary",
            fontWeight: 600,
          }}
        >
          {canProceed
            ? "Milestone requirement completed"
            : "Complete at least one milestone to continue"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <AppButton label="Back" colorKey="RED" onClick={onBack} width={180} />
          <AppButton
            label="Proceed to next step"
            colorKey="BLUE"
            width={180}
            disabled={!canProceed}
            onClick={() => onNext?.(projectId!)}
          />
        </Box>
      </Paper>

      <DynamicPopup
        open={popupKind !== null}
        onClose={closePopup}
        title={popupTitle}
        description={popupDescription}
        fields={scopePopupFields}
        fileUpload
        fileValue={uploadedFile}
        onFileChange={(f) => setUploadedFile(f)}
        buttonText="Save"
        buttonColor="BLUE"
        onSubmit={saveScope}
        disableSubmit={!scopeData.scopeText?.trim()}
      />
    </Box>
  );
}
