export interface IAdminPendingConsultant {
  id: number;
  username: string;
  status: string;
  experience: number;
  rate: number;
  weekly_available_hours: number;
  modules: {
    core: string;
    others: string;
  };
}

export type AdminConsultantRow = {
  id: number;
  avatar: string;
  name: string;
  coremodules: string;
  othersmodules: string;
  experience: string;
  hourlyRate: string;
  locked?: boolean;
};

export type AdminClientRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  activeprojects: number;
  completedprojects: number;
  draftprojects: number;
  profitMarginPercentage: number;
  locked?: boolean;
};

export interface AdminClientDTO {
  id: number;
  username?: string;
  email: string;
  phone?: string;
  status: "active" | "rejected" | "locked";
  profit_margin_percentage?: number;
  active_count?: number;
  completed_count?: number;
  draft_count?: number;
  user?: {
    email?: string;
    phone?: string;
  };
}

export interface CreateAdminClientPayload {
  email: string;
  password: string;
}

export interface UpdateClientProfitMarginPayload {
  clientId: number;
  profitMarginPercentage: number;
}
