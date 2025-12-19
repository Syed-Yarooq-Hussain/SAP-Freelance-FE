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
