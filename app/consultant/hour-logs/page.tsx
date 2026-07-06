"use client";

import { useConsultantHourLogs, useCreateConsultantHourLog } from "@/actions/consultants/useConsultantHourLogs";
import { useCreateMilestone } from "@/actions/projects/useCreateMilestone";
import { useCreateTask } from "@/actions/projects/useCreateTask";
import { useGetMilestoneTasks } from "@/actions/projects/useGetMilestoneTasks";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import { useConsultantProjects } from "@/actions/projects/useConsultantProjects";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/providers/ToastProvider";
import type { IConsultantHourLog, IConsultantPaymentDTO, IConsultantProject } from "@/types/consultant";
import type { IMilestone, ITask } from "@/types/teamBuilder";
import { formatCurrencyValue } from "@/utils/payments";
import { Add, Refresh } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConsultantPayments } from "@/actions/payments/useConsultantPayments";

const NO_TASK_VALUE = "__NO_TASK__";

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
};

const asArray = <T,>(value: T[] | null | undefined): T[] => value ?? [];

const getProjectId = (project: IConsultantProject) => project.project_id;
const getProjectName = (project: IConsultantProject) => project.project_name || `Project ${project.project_id}`;
const getTaskList = (data?: IMilestone | IMilestone[] | null): ITask[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.flatMap((item) => item.tasks ?? []);
  return data.tasks ?? [];
};

const getCurrentUserId = (sessionUser: unknown): string => {
  const user = sessionUser as Record<string, unknown> | undefined;
  return String(user?.id ?? user?.user_id ?? "");
};

export default function ConsultantHourLogsPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const currentUserId = getCurrentUserId(session?.user);

  const projects = useConsultantProjects();
  const milestones = useGetProjectMilestones();
  const tasks = useGetMilestoneTasks();
  const createLog = useCreateConsultantHourLog();
  const createMilestone = useCreateMilestone();
  const createTask = useCreateTask();
  const hourLogs = useConsultantHourLogs();
  const monthlyBills = useConsultantPayments();

  const [projectId, setProjectId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [taskId, setTaskId] = useState(NO_TASK_VALUE);
  const [hours, setHours] = useState("");
  const [logDate, setLogDate] = useState(today());
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    description: "",
    start_date: today(),
    due_date: today(),
    status: "Pending",
  });
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    assignee_id: currentUserId,
    required_hours: "",
    due_date: today(),
  });

  const projectOptions = asArray(projects.data?.data);
  const milestoneOptions = asArray(milestones.data?.data);
  const taskOptions = getTaskList(tasks.data?.data);

  const loadMilestones = useCallback(
    (id: string | number, nextMilestoneId?: string | number) => {
      milestones.mutate(id, {
        onSuccess: (res) => {
          const selected = nextMilestoneId ?? res.data?.[0]?.id;
          if (selected) {
            setMilestoneId(String(selected));
          }
        },
        onError: (err) => toast(err.message || "Failed to load milestones", "error"),
      });
    },
    [milestones, toast]
  );

  const loadTasks = useCallback(
    (id: string | number, nextTaskId?: string | number) => {
      tasks.mutate(id, {
        onSuccess: (res) => {
          const list = getTaskList(res.data);
          setTaskId(nextTaskId ? String(nextTaskId) : NO_TASK_VALUE);
          if (nextTaskId && !list.some((task) => String(task.id) === String(nextTaskId))) {
            setTaskId(NO_TASK_VALUE);
          }
        },
        onError: (err) => toast(err.message || "Failed to load tasks", "error"),
      });
    },
    [tasks, toast]
  );

  useEffect(() => {
    projects.mutate(undefined, {
      onError: (err) => toast(err.message || "Failed to load projects", "error"),
    });
    monthlyBills.mutate(undefined, {
      onError: (err) => toast(err.message || "Failed to load monthly bills", "error"),
    });
  }, []);

  useEffect(() => {
    if (projectId) {
      setMilestoneId("");
      setTaskId(NO_TASK_VALUE);
      loadMilestones(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (milestoneId) {
      setTaskId(NO_TASK_VALUE);
      loadTasks(milestoneId);
    }
  }, [milestoneId]);

  useEffect(() => {
    setNewTask((prev) => ({
      ...prev,
      assignee_id: prev.assignee_id || currentUserId,
    }));
  }, [currentUserId]);

  const canSubmit = projectId && milestoneId && Number(hours) > 0 && !createLog.isPending;

  const handleSubmit = () => {
    setFormError("");

    if (!projectId || !milestoneId) {
      setFormError("Project and milestone are required.");
      return;
    }

    const numericHours = Number(hours);
    if (!Number.isFinite(numericHours) || numericHours <= 0) {
      setFormError("Hours must be greater than 0.");
      return;
    }

    createLog.mutate(
      {
        project_id: projectId,
        milestone_id: milestoneId,
        ...(taskId !== NO_TASK_VALUE ? { task_id: taskId } : {}),
        hours: numericHours,
        ...(logDate ? { log_date: logDate } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
      },
      {
        onSuccess: () => {
          toast("Hours logged successfully", "success");
          setHours("");
          setDescription("");
          hourLogs.refetch();
          monthlyBills.mutate(undefined);
        },
        onError: (err) => {
          const message = err.message || "Failed to log hours";
          setFormError(message);
          toast(message, "error");
        },
      }
    );
  };

  const handleCreateMilestone = () => {
    if (!projectId || !newMilestone.name.trim()) {
      toast("Project and milestone name are required", "error");
      return;
    }

    createMilestone.mutate(
      {
        projectId,
        body: {
          ...newMilestone,
          name: newMilestone.name.trim(),
          description: newMilestone.description.trim(),
        },
      },
      {
        onSuccess: (res) => {
          toast("Milestone created successfully", "success");
          setMilestoneDialogOpen(false);
          setNewMilestone({
            name: "",
            description: "",
            start_date: today(),
            due_date: today(),
            status: "Pending",
          });
          loadMilestones(projectId, res.data?.id);
        },
        onError: (err) => toast(err.message || "Failed to create milestone", "error"),
      }
    );
  };

  const handleCreateTask = () => {
    if (!milestoneId || !newTask.name.trim() || Number(newTask.required_hours) <= 0) {
      toast("Task name, milestone, and required hours are required", "error");
      return;
    }

    createTask.mutate(
      {
        milestoneId,
        body: {
          name: newTask.name.trim(),
          description: newTask.description.trim(),
          assignee_id: newTask.assignee_id || currentUserId || "",
          required_hours: Number(newTask.required_hours),
          due_date: newTask.due_date,
        },
      },
      {
        onSuccess: (res) => {
          toast("Task created successfully", "success");
          setTaskDialogOpen(false);
          setNewTask({
            name: "",
            description: "",
            assignee_id: currentUserId,
            required_hours: "",
            due_date: today(),
          });
          loadTasks(milestoneId, res.data?.id);
        },
        onError: (err) => toast(err.message || "Failed to create task", "error"),
      }
    );
  };

  const logRows = asArray(hourLogs.data?.data);
  const monthlyRows = useMemo(
    () => asArray(monthlyBills.data?.data).flatMap((group: IConsultantPaymentDTO) =>
      asArray(group.bills).map((bill) => ({
        id: bill.id,
        month: group.month || "N/A",
        project: group.project?.name || group.project_name || "N/A",
        milestone: bill.milestone?.name || "N/A",
        task: bill.task?.name || "-",
        log_date: bill.log_date || "N/A",
        hours: bill.hours ?? 0,
        amount: bill.amount ?? 0,
        is_paid: Boolean(bill.is_paid),
        bill_type: bill.bill_type || "logged",
        description: bill.description || "",
        pdf_url: bill.pdf_url,
      }))
    ),
    [monthlyBills.data?.data]
  );

  return (
    <Sidebar>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1.5} mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700}>Log Hours</Typography>
              <Typography variant="body2" color="text.secondary">
                Track project work by milestone, with an optional task.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                projects.mutate();
                hourLogs.refetch();
                monthlyBills.mutate(undefined);
              }}
            >
              Refresh
            </Button>
          </Stack>

          {formError ? <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert> : null}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
            <TextField
              select
              required
              label="Project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={projects.isPending}
              helperText={projects.isPending ? "Loading projects..." : projectOptions.length === 0 ? "No projects found" : ""}
            >
              {projectOptions.map((project) => (
                <MenuItem key={getProjectId(project)} value={String(getProjectId(project))}>
                  {getProjectName(project)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              required
              label="Milestone"
              value={milestoneId}
              onChange={(event) => setMilestoneId(event.target.value)}
              disabled={!projectId || milestones.isPending}
              helperText={milestones.isPending ? "Loading milestones..." : projectId && milestoneOptions.length === 0 ? "No milestones found" : ""}
            >
              {milestoneOptions.map((milestone) => (
                <MenuItem key={milestone.id} value={String(milestone.id)}>
                  {milestone.name}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" gap={1} alignItems="flex-start">
              <TextField
                select
                fullWidth
                label="Task"
                value={taskId}
                onChange={(event) => setTaskId(event.target.value)}
                disabled={!milestoneId || tasks.isPending}
                helperText={tasks.isPending ? "Loading tasks..." : milestoneId && taskOptions.length === 0 ? "No tasks found" : ""}
              >
                <MenuItem value={NO_TASK_VALUE}>No task / milestone level work</MenuItem>
                {taskOptions.map((task) => (
                  <MenuItem key={task.id} value={String(task.id)}>
                    {task.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                sx={{ minWidth: 44, height: 56 }}
                disabled={!milestoneId}
                onClick={() => setTaskDialogOpen(true)}
              >
                <Add />
              </Button>
            </Stack>

            <TextField
              required
              label="Hours"
              type="number"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              inputProps={{ min: 0.01, step: 0.25 }}
            />

            <TextField
              label="Log date"
              type="date"
              value={logDate}
              onChange={(event) => setLogDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="outlined"
              startIcon={<Add />}
              disabled={!projectId}
              onClick={() => setMilestoneDialogOpen(true)}
              sx={{ minHeight: 56 }}
            >
              Add milestone
            </Button>
          </Box>

          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline
            minRows={3}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button variant="contained" disabled={!canSubmit} onClick={handleSubmit}>
              {createLog.isPending ? <CircularProgress size={18} color="inherit" /> : "Submit hours"}
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={1.5}>Logged Hours</Typography>
          <LogsTable loading={hourLogs.isLoading} rows={logRows} />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={1.5}>Monthly Bills</Typography>
          <MonthlyBillsTable loading={monthlyBills.isPending} rows={monthlyRows} />
        </Paper>
      </Box>

      <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create additional milestone</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Name" value={newMilestone.name} onChange={(e) => setNewMilestone((p) => ({ ...p, name: e.target.value }))} required />
          <TextField label="Description" value={newMilestone.description} onChange={(e) => setNewMilestone((p) => ({ ...p, description: e.target.value }))} multiline minRows={3} />
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <TextField fullWidth label="Start date" type="date" value={newMilestone.start_date} onChange={(e) => setNewMilestone((p) => ({ ...p, start_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Due date" type="date" value={newMilestone.due_date} onChange={(e) => setNewMilestone((p) => ({ ...p, due_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
          </Stack>
          <TextField label="Status" value={newMilestone.status} onChange={(e) => setNewMilestone((p) => ({ ...p, status: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={createMilestone.isPending} onClick={handleCreateMilestone}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create task</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Name" value={newTask.name} onChange={(e) => setNewTask((p) => ({ ...p, name: e.target.value }))} required />
          <TextField label="Description" value={newTask.description} onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))} multiline minRows={3} />
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <TextField fullWidth label="Assignee ID" type="number" value={newTask.assignee_id} onChange={(e) => setNewTask((p) => ({ ...p, assignee_id: e.target.value }))} />
            <TextField fullWidth label="Required hours" type="number" value={newTask.required_hours} onChange={(e) => setNewTask((p) => ({ ...p, required_hours: e.target.value }))} inputProps={{ min: 0.01, step: 0.25 }} required />
          </Stack>
          <TextField label="Due date" type="date" value={newTask.due_date} onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={createTask.isPending} onClick={handleCreateTask}>Create</Button>
        </DialogActions>
      </Dialog>
    </Sidebar>
  );
}

function LogsTable({ rows, loading }: { rows: IConsultantHourLog[]; loading: boolean }) {
  if (loading) return <CenteredLoading />;
  if (!rows.length) return <EmptyState label="No hour logs found" />;

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          <TableCell>Project</TableCell>
          <TableCell>Milestone</TableCell>
          <TableCell>Task</TableCell>
          <TableCell>Log Date</TableCell>
          <TableCell align="right">Hours</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Paid Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.project?.name || row.project_name || "N/A"}</TableCell>
            <TableCell>{row.milestone?.name || row.milestone_name || "N/A"}</TableCell>
            <TableCell>{row.task?.name || row.task_name || "-"}</TableCell>
            <TableCell>{row.log_date || "N/A"}</TableCell>
            <TableCell align="right">{row.hours}</TableCell>
            <TableCell align="right">{formatCurrencyValue(row.amount ?? 0)}</TableCell>
            <TableCell>{row.description || ""}</TableCell>
            <TableCell><PaidChip isPaid={Boolean(row.is_paid)} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </ResponsiveTable>
  );
}

function MonthlyBillsTable({
  rows,
  loading,
}: {
  rows: {
    id: string | number;
    month: string;
    project: string;
    milestone: string;
    task: string;
    log_date: string;
    hours: number;
    amount: number;
    is_paid: boolean;
    bill_type: string;
    description: string;
    pdf_url: string | null;
  }[];
  loading: boolean;
}) {
  if (loading) return <CenteredLoading />;
  if (!rows.length) return <EmptyState label="No monthly bills found" />;

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          <TableCell>Month</TableCell>
          <TableCell>Project</TableCell>
          <TableCell>Milestone</TableCell>
          <TableCell>Task</TableCell>
          <TableCell>Log Date</TableCell>
          <TableCell align="right">Hours</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Bill Type</TableCell>
          <TableCell>Paid Status</TableCell>
          <TableCell>PDF</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.month}</TableCell>
            <TableCell>{row.project}</TableCell>
            <TableCell>{row.milestone}</TableCell>
            <TableCell>{row.task}</TableCell>
            <TableCell>{row.log_date}</TableCell>
            <TableCell align="right">{row.hours}</TableCell>
            <TableCell align="right">{formatCurrencyValue(row.amount)}</TableCell>
            <TableCell>{row.bill_type}</TableCell>
            <TableCell><PaidChip isPaid={row.is_paid} /></TableCell>
            <TableCell>{row.pdf_url ? <Button size="small" onClick={() => window.open(row.pdf_url!, "_blank", "noopener,noreferrer")}>View</Button> : "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </ResponsiveTable>
  );
}

function PaidChip({ isPaid }: { isPaid: boolean }) {
  return <Chip size="small" color={isPaid ? "success" : "warning"} variant={isPaid ? "filled" : "outlined"} label={isPaid ? "Paid" : "Unpaid"} />;
}

function CenteredLoading() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
      <CircularProgress size={24} />
    </Box>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Box sx={{ border: "1px dashed #D1D5DB", borderRadius: 1, py: 4, textAlign: "center", color: "text.secondary" }}>
      {label}
    </Box>
  );
}

function ResponsiveTable({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Divider sx={{ mb: 1 }} />
      <TableContainer component={Box} sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 980 }}>
          {children}
        </Table>
      </TableContainer>
    </>
  );
}
