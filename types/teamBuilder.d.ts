export interface ShortlistedRow {
  id: string | number;
  coremodules: string;
  othersmodules: string;
  experience: string;
  hourlyRate: string;
  status: string;
  interview: STATUS | string;
}

export interface CandidateRow {
  id: number;
  avatar: string;
  name: string;
  coremodules: string;
  othersmodules: string;
  experience: string;
  hourlyRate: string;
  signed: string;
  role?: string;
  status?: string;
  working_schedule?: {
    weekdays: {
      day: string;
      start?: string;
      end?: string;
      active: boolean;
    }[];
  };
}

export type TeamCreationProps = {
  onNext?: (projectId: string) => void;
};

export interface TeamBuilderRow {
  id: string | number;
  coremodules: string;
  othersmodules: string;
  experience: string;
  rate: string;
  avail: number;
  request: number;
  error?: string;
  avatar?: string;
  working_schedule?: {
    weekdays: {
      day: string;
      start?: string;
      end?: string;
      active: boolean;
    }[];
  };
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

export interface IProjectConsultant {
  id: string;
  consultant_id: string;
  project_id: string;
  project_consultants_id;
  status: string;
  role: string | null;
  decided_rate: number;
  booking_schedule?: {
    date_time: string;
    status: string;
  } | null;
  is_joic_signed: boolean;
  is_doc_signed: boolean;
  requested_hours: number;
  deleted_at: string | null;
  name: string;
  experience: number;
  rate: number;
  modules: {
    core: string;
    others: string;
  };
  working_schedule?: {
    weekdays: {
      day: string;
      start?: string;
      end?: string;
      active: boolean;
    }[];
  };
}

export interface IMeeting {
  created_at: string;
  deleted_at: string | null;
  id: number;
  sender_id: number;
  url: string;
  date_time: string;
  duration: number;
  status: string;
  event_type: string;
  project_id: number | null;
}

export interface IMeetingInvitee {
  deleted_at: string | null;
  id: number;
  meeting_id: number;
  user_id: number;
}

export interface IMeetingInviteResponse {
  message: string;
  meeting: IMeeting;
  invitees: IMeetingInvitee[];
}

export interface IMeetingInviteBody {
  date_time: string;
  invitees_id: number[];
  duration: number;
  event_type: "interview";
  project_id: number;
}

export interface IUpdateConsultantStatusPayload {
  consultant_id: number | string;
  project_id: number | string;
  status: string;
  role: string;
  booking_schedule?: {
    weekdays: {
      day: string;
      start?: string;
      end?: string;
      active: boolean;
    }[];
  };
}

export type IUpdateConsultantStatusResponse = [number, IProjectConsultant[]];

type TeamConfirmationProps = {
  onNext?: (projectId: string) => void;
  projectId?: string | null;
};

type Weekday = NonNullable<
  NonNullable<TeamBuilderRow["working_schedule"]>["weekdays"]
>[number];

type ClientConsultantDTO = {
  id: string | number;
  experience?: number;
  rate?: number;
  weekly_available_hours?: number;
  modules?: {
    core?: string;
    others?: string;
  };
  working_schedule?: TeamBuilderRow["working_schedule"];
};