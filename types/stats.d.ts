export interface IAdminStatsResponse {
  total_consultants: number;
  total_clients: number;
  active_consultants: number;
  active_clients: number;
  active_projects: number;
  upcoming_projects: number;
  pending_consultant_approvals: number;
  interview_this_week: number;
}