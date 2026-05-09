export interface ClientConsultantRow {
  id: number | string;
  avatar: string;
  name: string;
  coremodules: string;
  othersmodules: string;
  experience: string;
  hourlyRate: string;
  projectName: string;
  working_schedule?: {
    weekdays: {
      day: string;
      start?: string;
      end?: string;
      active: boolean;
    }[];
  };
}

export interface IClientPaymentProject {
  id: string;
  name: string;
  client_id: string;
  company_name: string;
  status: string;
  deleted_at: string | null;
}

export interface IClientPaymentMilestone {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  due_date: string;
  status: string;
  required_hours: number;
  project_id: string;
  deleted_at: string | null;
}

export interface IClientPaymentDocument {
  id: string | null;
  url: string | null;
  type: string | null;
  deleted_at: string | null;
}

export interface IClientPaymentDTO {
  id: string;
  project_id: string;
  project_milestone_id: string;
  doc_id: string | null;
  amount: number;
  payment_module: string;
  is_paid: boolean | null;
  deleted_at: string | null;
  project: IClientPaymentProject;
  milestone?: IClientPaymentMilestone | null;
  document?: IClientPaymentDocument | null;
  due_date: string;
}

export interface ClientPaymentRow {
  id: string;
  project: string;
  duedates: string;
  amount: string;
  status: string;
  receiptUrl: string;
  is_paid: boolean;
  payment_module: string;
}

export interface IClientProjectDTO {
  id: string;
  name: string;
  client_id: string;
  company_name: string;
  status: string;
  deleted_at: string | null;

  projectDetails?: {
    id: string;
    start_date: string;
    end_date: string;
    duration: string;
    cost: number;
    paid_amount: number;
    project_id: string;
    deleted_at: string | null;
  };

  members: number;
}

export interface ClientProjectRow {
  id: string;
  name: string;
  members: number;
  duration: string;
  spend: string;
  startdate: string;
  estimated: string;
  status: string;
}

export interface IClientMeetingDTO {
  id: number | string;
  sender_id?: number;
  url?: string;
  date_time: string;
  duration: number | null;
  status: string;
  event_type: string;
  project_id?: number | string;
  created_at: string;
  sender_name?: string;
  invitees_names?: string;
  project_name?: string;
}

export interface ClientMeetingRow {
  id: number;
  consultant: string;
  projectname: string;
  requestDate: string;
  datetime: string;
  duration: string;
  status: string;
}

export interface MeetingForm {
  project: string;
  user: string;
  date: string;
  time: string;
  duration: string;
  meeting_type: string;
  [key: string]: string;
}

export interface ClientInterviewRow {
  id: number | string;
  consultant: string;
  projectname: string;
  requestDate: string;
  datetime: string;
  duration: string | number;
  status: string;
}

export interface IClientDashboardStats {
  number_of_project: number;
  interview_schedule: number;
  total_spend_on_project: number;
  pending_invoices: number;
}

export interface IClientMeetingsStats {
  interview_requests: number;
  upcoming_interviews: number;
  rescheduled_interviews: number;
  cancelled_interviews: number;
}

export interface IClientPaymentProjectClient {
  id: number;
  username: string;
  email: string;
  status: string;
}
export interface IClientPaymentProject {
  id: string;
  name: string;
  client_id: string;
  company_name: string;
  status: string;
  deleted_at: string | null;
  client?: IClientPaymentProjectClient | null;
}

export interface IClientPaymentDTO {
  project_milestone_id: string | null;
  milestone?: IClientPaymentMilestone | null;
}
