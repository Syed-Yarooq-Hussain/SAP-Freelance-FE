export interface IAdminConsultantPayment {
  id: string | number;
  user_id?: string | number;
  consultant_id?: string | number;
  user?: {
    id?: string | number;
    username?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  consultant?: {
    id?: string | number;
    name?: string | null;
    email?: string | null;
    user?: {
      username?: string | null;
      name?: string | null;
      email?: string | null;
    } | null;
  } | null;
  project?: {
    id?: string | number;
    name?: string | null;
    company_name?: string | null;
    client?: {
      username?: string | null;
      name?: string | null;
      email?: string | null;
      company_name?: string | null;
    } | null;
  } | null;
  client?: {
    username?: string | null;
    name?: string | null;
    email?: string | null;
    company_name?: string | null;
  } | null;
  milestone?: {
    id?: string | number;
    name?: string | null;
  } | null;
  task?: {
    id?: string | number;
    name?: string | null;
  } | null;
  project_name?: string | null;
  client_name?: string | null;
  milestone_name?: string | null;
  task_name?: string | null;
  task_id?: string | number | null;
  month?: string | null;
  log_date?: string | null;
  hours?: number | null;
  amount?: number | null;
  bill_type?: "logged" | "auto" | string | null;
  is_paid?: boolean | null;
  pdf_url?: string | null;
}

export interface IMarkConsultantPaymentPaidPayload {
  pdf_url: string;
}
