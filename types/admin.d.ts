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
  locked?: boolean;
};
