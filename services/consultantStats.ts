import type { ApiResponse } from "@/types/api";
import {
  IConsultantDashboardStats,
  IConsultantMeetingsStats,
} from "@/types/consultant";
import { IConsultantProjectsStats } from "@/types/projects";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export interface IConsultantStatsResponse {
  dashboard: IConsultantDashboardStats;
  projects_stats: IConsultantProjectsStats;
  meetings_stats: IConsultantMeetingsStats;
}

export async function fetchConsultantStats(): Promise<
  ApiResponse<IConsultantStatsResponse>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;
  const res = await request<undefined, IConsultantStatsResponse>({
    url: API_ROUTES.CONSULTANT_STATS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to fetch consultant stats");
  }

  return res;
}
