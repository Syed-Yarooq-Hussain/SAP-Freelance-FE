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
  industries: string | null;
  professional_headline: string | null;
  expertise_level: string | null;
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
  consultant_id?: number;
  company_name: string;
  status: string;
  deleted_at: string | null;
}

export interface IConsultantPaymentDocument {
  id?: string | null;
  url?: string | null;
  type?: string | null;
  deleted_at?: string | null;
}

export interface IConsultantMonthlyBillItem {
  id: number | string;
  milestone_id: number | string;
  hours: number;
  amount: number;
  is_paid: boolean | null;
  pdf_url: string | null;
}

export interface IConsultantPaymentDTO {
  id?: string;
  project_id?: string;
  project_milestone_id?: string | null;
  doc_id?: string | null;
  amount?: number;
  total_amount?: number;
  payable_amount?: number;
  consultant_amount?: number;
  payment_module?: string;
  status?: string | null;
  is_paid: boolean | null;
  deleted_at?: string | null;
  project?: IConsultantPaymentProject | null;
  project_name?: string | null;
  month?: string | null;
  billing_month?: string | null;
  bill_month?: string | null;
  due_date?: string | null;
  created_at?: string | null;
  pdf_url?: string | null;
  pdfUrl?: string | null;
  invoice_url?: string | null;
  bill_pdf_url?: string | null;
  document?: IConsultantPaymentDocument | null;
  total_hours?: number;
  bills?: IConsultantMonthlyBillItem[];
}

export interface ConsultantPaymentRow {
  id: string;
  project: string;
  duedates: string;
  totalHours: string;
  amount: string;
  status: string;
  pdfUrl: string;
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
