import type { ApiResponse } from "@/types/api";
import { IAdminStatsResponse } from "@/types/stats";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function fetchAdminStats(): Promise<
  ApiResponse<IAdminStatsResponse>
> {
  const res = await request<undefined, IAdminStatsResponse>({
    url: API_ROUTES.ADMIN_STATS,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to fetch admin stats");
  }

  return res;
}
