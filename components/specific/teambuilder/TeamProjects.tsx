"use client";

import { useCreateMilestone } from "@/actions/projects/useCreateMilestone";
import { useCreateTask } from "@/actions/projects/useCreateTask";
import { useGetMilestoneTasks } from "@/actions/projects/useGetMilestoneTasks";
import { useGetProject } from "@/actions/projects/useGetProject";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import { useUpdateMilestone } from "@/actions/projects/useUpdateMilestone";
import { useUpdateProject } from "@/actions/projects/useUpdateProject";
import { useUpdateTask } from "@/actions/projects/useUpdateTask";
import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import { getMilestoneCols, taskColumns } from "@/data/teamBuilder";
import { getMilestoneFormFields } from "@/forms/milestoneForm";
import { getProjectFormFields } from "@/forms/projectForm";
import { getTaskFormFields } from "@/forms/taskForm";
import { useToast } from "@/providers/ToastProvider";
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
import { Box, Typography } from "@mui/material";
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
  const [scopeText, setScopeText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
      status: "active",
      required_hours: 0,
      project_id: projectId!,
    };

    updateMilestone.mutate(
      { milestoneId: editingMilestone.id, body: payload },
      {
        onSuccess: () => {
          toast("Milestone updated!", "success");
          getMilestoneTasks.mutate(editingMilestone.id, {
            onSuccess: (res) => {
              const m: IMilestone = res.data!;

              setRows((prev) =>
                prev.map((row) =>
                  row.id === editingMilestone.id
                    ? {
                        ...row,
                        name: m.name,
                        description: m.description ?? "",
                        date: m.due_date?.split("T")[0] ?? "",
                        tasks: m.tasks?.length ?? 0,
                      }
                    : row
                )
              );
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

  const handleSubmit = useCallback(
    (data: TeamProjectFormData) => {
      if (!projectId) {
        toast("Project ID missing! Please complete Step 01 again.", "error");
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

            getProject.mutate(projectId, {
              onSuccess: (fresh) => {
                console.log("Updated project fetched:", fresh.data);
                toast("Latest project loaded!", "success");
              },
              onError: (err: Error) => {
                toast(err.message, "error");
              },
            });
          },
          onError: (err: Error) => {
            toast(err.message, "error");
          },
        }
      );
    },
    [updateProject, toast, session, getProject, projectId]
  );

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

  const handleExpandMilestone = useCallback(
    (id: number) => {
      setExpandedMilestoneId((prev) => (prev === id ? null : id));

      setDynamicTasks((prev) => {
        if (!prev[id]) {
          fetchTasksForMilestone(id);
        }
        return prev;
      });
    },
    [fetchTasksForMilestone]
  );

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

              const mapped: MilestoneRow[] = updatedList.map(
                (m: IMilestone) => ({
                  id: Number(m.id),
                  name: m.name,
                  date: m.due_date?.split("T")[0] ?? "",
                  description: m.description ?? "",
                  approval: (m.description ? "Required" : "Not required") as
                    | "Required"
                    | "Not required",
                  tasks: m.tasks?.length ?? 0,
                })
              );

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
    setScopeText("");
    setUploadedFile(null);
  };

  const closePopup = () => {
    setPopupKind(null);
    setScopeText("");
    setUploadedFile(null);
  };

  const saveScope = () => {
    console.log(`Saved ${popupKind} scope:`, {
      description: scopeText.trim(),
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

  const milestoneCols = useMemo(
    () =>
      getMilestoneCols(
        expandedMilestoneId,
        handleExpandMilestone,
        handleEditMilestoneClick
      ),
    [expandedMilestoneId, handleExpandMilestone, handleEditMilestoneClick]
  );

  const milestoneFormElements = useMemo(
    () =>
      getMilestoneFormFields().map((f) => {
        if (!editingMilestone) return f;

        if (f.name === "milestoneName") {
          return { ...f, defaultValue: editingMilestone.name };
        }
        if (f.name === "milestoneEnd") {
          return { ...f, defaultValue: editingMilestone.date };
        }
        if (f.name === "milestoneDescDoc") {
          return { ...f, defaultValue: editingMilestone.description };
        }
        return f;
      }),
    [editingMilestone]
  );

  const taskFormElements = useMemo(() => {
    const milestoneOptions = rows.map((m) => ({
      label: m.name,
      value: String(m.id),
    }));

    return getTaskFormFields(milestoneOptions).map((el) => {
      if (el.name === "taskMilestone") {
        return {
          ...el,
          options: milestoneOptions,
          defaultValue: editingTask ? String(expandedMilestoneId) : undefined,
          disabled: !!editingTask,
        };
      }

      if (!editingTask) return el;

      if (el.name === "taskName")
        return { ...el, defaultValue: editingTask.name };

      if (el.name === "taskEnd")
        return { ...el, defaultValue: editingTask.date };

      if (el.name === "taskDoc")
        return { ...el, defaultValue: editingTask.description };

      if (el.name === "taskAssignee")
        return { ...el, defaultValue: editingTask.assignees };

      return el;
    });
  }, [editingTask, expandedMilestoneId, rows]);

  const loadAllMilestones = useCallback(() => {
    if (!projectId) return;

    getProjectMilestones.mutate(projectId, {
      onSuccess: async (fresh) => {
        const milestones: IMilestone[] = fresh.data ?? [];

        const mapped: MilestoneRow[] = milestones.map((m) => ({
          id: Number(m.id),
          name: m.name,
          date: m.due_date?.split("T")[0] ?? "",
          description: m.description ?? "",
          approval: m.description ? "Required" : "Not required",
          tasks: 0,
        }));

        setRows(mapped);

        const results = await Promise.all(
          milestones.map(
            (m) =>
              new Promise<{ milestoneId: number; count: number }>((resolve) => {
                if (dynamicTasks[Number(m.id)]) {
                  resolve({
                    milestoneId: Number(m.id),
                    count: dynamicTasks[Number(m.id)].length,
                  });
                  return;
                }
                getMilestoneTasks.mutate(Number(m.id), {
                  onSuccess: (res) => {
                    const tasks: ITask[] = res.data?.tasks ?? [];

                    const mappedTasks: TaskRow[] = tasks.map((t) => ({
                      id: String(t.id),
                      name: t.name,
                      description: t.description,
                      assignees: String(t.assignee_id ?? ""),
                      date: STATIC_TASK_DATE,
                    }));

                    setDynamicTasks((prev) => ({
                      ...prev,
                      [Number(m.id)]: mappedTasks,
                    }));

                    resolve({
                      milestoneId: Number(m.id),
                      count: mappedTasks.length,
                    });
                  },
                });
              })
          )
        );

        setRows((prev) =>
          prev.map((row) => {
            const match = results.find((r) => r.milestoneId === row.id);
            return match ? { ...row, tasks: match.count } : row;
          })
        );
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
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        mt: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Basic Details
      </Typography>

      <CreateForm
        elements={getProjectFormFields().map((f) =>
          f.name === "client"
            ? {
                ...f,
                defaultValue: session?.user?.username ?? "",
                disabled: true,
              }
            : f
        )}
        onSuccess={handleSubmit}
        actionsContainerProps={{
          sx: { mt: 2, justifyContent: "flex-start" },
        }}
        submitButton={{ children: "Add" }}
      />

      <Box sx={{ borderTop: "1px solid #eee", my: 2 }} />

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Project Scope
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
        }}
      >
        <AppButton
          label="Add Functional Scope"
          colorKey="BLUE"
          onClick={() => openPopup("functional")}
          sx={{ width: "100%" }}
        />
        <AppButton
          label="Add Technical Scope"
          colorKey="BLUE"
          onClick={() => openPopup("technical")}
          sx={{ width: "100%" }}
        />
        <AppButton
          label="Add Out of Scope"
          colorKey="BLUE"
          onClick={() => openPopup("out")}
          sx={{ width: "100%" }}
        />
      </Box>

      <Box sx={{ borderTop: "1px solid #eee", my: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Milestones
        </Typography>

        <DataTable<MilestoneRow>
          title=""
          columns={milestoneCols}
          rows={rows}
          pageSize={5}
        />

        {expandedMilestoneId !== null && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              border: "1px solid #d8dfef",
              bgcolor: "#fbfcff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Task
            </Typography>

            <DataTable<TaskRow>
              title=""
              columns={taskColumns(handleEditTaskClick)}
              rows={dynamicTasks[expandedMilestoneId] || []}
              pageSize={4}
            />

            <CreateForm
              key={taskFormKey}
              elements={taskFormElements}
              onSuccess={editingTask ? handleUpdateTask : handleAddTask}
              actionsContainerProps={{
                sx: { mt: 2, justifyContent: "flex-start" },
              }}
              submitButton={{ children: editingTask ? "Update" : "Add" }}
            />
          </Box>
        )}

        <CreateForm
          key={milestoneFormKey}
          elements={milestoneFormElements}
          onSuccess={
            editingMilestone ? handleUpdateMilestone : handleAddMilestone
          }
          actionsContainerProps={{
            sx: { mt: 2, justifyContent: "flex-start" },
          }}
          submitButton={{ children: editingMilestone ? "Update" : "Add" }}
        />
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box />
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <AppButton
            label="Discard"
            colorKey="RED"
            onClick={onBack}
            width={180}
          />
          <AppButton
            label="Proceed to next step"
            colorKey="BLUE"
            onClick={onNext}
            width={180}
          />
        </Box>
      </Box>

      <DynamicPopup
        open={popupKind !== null}
        onClose={closePopup}
        title={popupTitle}
        description={popupDescription}
        fields={[
          {
            id: "scope",
            label: "",
            type: "text",
            value: scopeText,
            onChange: (val: string | File) =>
              typeof val === "string" && setScopeText(val),
            placeholder: "Description",
          },
        ]}
        fileUpload
        fileValue={uploadedFile}
        onFileChange={(f) => setUploadedFile(f)}
        buttonText="Save"
        buttonColor="BLUE"
        onSubmit={saveScope}
        disableSubmit={!scopeText.trim()}
      />
    </Box>
  );
}
