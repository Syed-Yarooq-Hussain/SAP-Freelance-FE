import type { ApiResponse } from "@/types/api";
import type { ConsultantDashboardSummaryData } from "@/types/adminDashboard";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function fetchConsultantDashboardSummary(): Promise<
  ApiResponse<ConsultantDashboardSummaryData>
> {
  const res = await request<undefined, ConsultantDashboardSummaryData>({
    url: API_ROUTES.ADMIN_CONSULTANT_SUMMARY,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to fetch consultant dashboard summary");
  }

  return res;
}
