import { IBaseUser, IUser } from "./common-auth";

export interface IConsultantSignupPayload {
  user: IBaseUser;
  consultant: IConsultantExtra;
}

export interface IConsultantMeta {
  id: number;
  module_id: number | null;
  level_id: number | null;
  experience: number | null;
  rate: number | null;
  weekly_available_hours: number | null;
  user_id: string;
  working_schedule: unknown | null;
  skills: unknown | null;
  career_details: unknown | null;
}

export interface IConsultantUser extends IUser {
  consultants: IConsultantMeta;
}

export interface IConsultantProject {
  requested_hours: number | null;
  duration: number | null;
  project_id: string;
  project_name: string;
  project_status: string;
  client_id: number;
  client_name: string;
  modules: string[];
  start_date: string;
}

export interface IConsultantProjectRow {
  id: number;
  project_name: string;
  client_name: string;
  modules: string;
  duration: string | null;
  start_date: string;
  status: string;
}

export interface IConsultantPaymentProject {
  id: string;
  name: string;
  consultant_id: number;
  company_name: string;
  status: string;
  deleted_at: string | null;
}

export interface IConsultantPaymentDTO {
  id: string;
  project_id: string;
  project_milestone_id: string | null;
  doc_id: string | null;
  amount: number;
  payment_module: string;
  is_paid: boolean | null;
  deleted_at: string | null;
  project: IConsultantPaymentProject;
  due_date: string;
}

export interface ConsultantPaymentRow {
  id: string;
  project: string;
  duedates: string;
  amount: string;
  status: string;
  invoice: string;
}

export interface IConsultantDashboardStats {
  appeared_in_search: number;
  interview_schedule: number;
  projected_monthly_revenue: number;
  total_earnings: number;
}

export interface IConsultantMeetingsStats {
  interview_requests: number;
  upcoming_interviews: number;
  rescheduled_interviews: number;
  cancelled_interviews: number;
}
