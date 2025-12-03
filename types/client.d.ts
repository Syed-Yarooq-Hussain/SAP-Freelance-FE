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

export interface IClientPaymentDTO {
  id: string;
  project_id: string;
  project_milestone_id: string;
  doc_id: string;
  amount: number;
  payment_module: string;
  is_paid: boolean | null;
  deleted_at: string | null;
  project: IClientPaymentProject;
  due_date: string;
}

export interface ClientPaymentRow {
  id: string;
  project: string;
  duedates: string;
  amount: string;
  status: string;
  invoice: string;
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
