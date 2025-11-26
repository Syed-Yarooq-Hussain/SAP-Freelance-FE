import type { STATUS } from "@/constants/status_dropdown";

export interface ShortlistedRow {
  id: string;
  modules: string;
  experience: string;
  hourlyRate: string;
  status: STATUS;
  interview: string;
}

export interface CandidateRow {
  id: number;
  avatar: string;
  name: string;
  modules: string;
  experience: string;
  hourlyRate: string;
  signed: string;
  role: string;
}

export type TeamCreationProps = {
  onNext?: (projectId: string) => void;
};

export interface TeamBuilderRow {
  id: string | number;
  modules: string;
  experience: string;
  rate: string;
  avail: number;
  request: number;
  avatar?: string;
}

export interface ITask {
  id: string;
  name: string;
  description: string;
  assignee_id: number | null;
  project_milestone_id: string;
  project_id: string;
  required_hours: number;
  due_date?: string;
}

export interface IMilestone {
  id: string | number;
  name: string;
  description: string | null;
  due_date: string;
  status: string;
  required_hours: number;
  project_id: number | string;
  tasks?: ITask[];
}

export interface ICreateMilestonePayload {
  name: string;
  description: string;
  due_date: string;
  status: string;
  required_hours: number;
  project_id: string | number;
}

export interface ICreateTaskPayload {
  name: string;
  description: string;
  assignee_id: number | string;
  required_hours: number;
  project_milestone_id: number | string;
  project_id: number | string;
}

export interface IUpdateTaskPayload {
  name: string;
  description: string;
  assignee_id: number;
  required_hours: number;
  project_milestone_id: number;
  project_id: number;
}

export type MilestoneRow = {
  id: number;
  name: string;
  date: string;
  description: string;
  approval: "Required" | "Not required";
  tasks: number;
};

export type TaskRow = {
  id: string;
  name: string;
  date: string;
  description: string;
  assignees: string;
};

export type TasksByMilestone = Record<number, TaskRow[]>;

export type TeamProjectsProps = {
  onBack?: () => void;
  onNext?: () => void;
  projectId?: string | null;
};

export interface TeamProjectFormData {
  projectName?: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  industry?: string;
  duration?: string;
  milestoneName?: string;
  milestoneDescDoc?: string;
  milestoneEnd?: string;
  taskMilestone?: string | number;
  taskName?: string;
  taskEnd?: string;
  taskDoc?: string;
  taskAssignee?: string;
}

export interface IUpdateProjectPayload {
  name?: string;
  client_id?: string | number;
  company_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  industry?: string;
  duration?: number;
  cost?: number;
  paid_amount?: number;
}

export interface IAddConsultantsPayload {
  consultant_id: number;
  requested_hours: number;
}

export interface IAddConsultantsResponse {
  consultant_id: number;
  requested_hours: number;
}
