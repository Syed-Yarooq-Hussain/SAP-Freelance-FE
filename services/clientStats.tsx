import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";
import { IClientDashboardStats, IClientMeetingsStats } from "@/types/client";

export interface IClientStatsResponse {
  dashboard: IClientDashboardStats;
  meetings_stats: IClientMeetingsStats;
}

export async function fetchClientStats(): Promise<
  ApiResponse<IClientStatsResponse>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const res = await request<undefined, IClientStatsResponse>({
    url: API_ROUTES.CLIENT_STATS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to fetch client stats");
  }

  return res;
}
