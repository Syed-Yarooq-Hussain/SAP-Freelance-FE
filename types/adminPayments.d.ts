import type {
  IClientPaymentDTO,
  IClientPaymentMilestone,
  IClientPaymentProject,
} from "./client";

export interface IAdminConsultantBillUser {
  id: number;
  username: string;
  email: string;
  status: string;
}

export interface IAdminConsultantMonthlyBill {
  id: number;
  project_id: number;
  user_id: number;
  milestone_id: number;
  month: string;
  hours: number;
  amount: number;
  is_paid: boolean;
  pdf_url: string | null;
  project: IClientPaymentProject;
  milestone: IClientPaymentMilestone | null;
  user: IAdminConsultantBillUser;
}

export interface IAdminPaymentsAggregate {
  client_payments: IClientPaymentDTO[];
  consultant_payments: IAdminConsultantMonthlyBill[];
}