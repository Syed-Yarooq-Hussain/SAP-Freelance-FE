import type { ConsultantStatus } from "@/constants/status";
import type { ApiResponse } from "@/types/api";
import { IProjectConsultant } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function getProjectConsultantsService(
  projectId: string | number,
  statuses: ConsultantStatus[],
  page?: number,
  billingCurrency?: "USD",
): Promise<ApiResponse<IProjectConsultant[]>> {
  const session = await getCachedSession();
  const token = session?.accessToken;
  const params = new URLSearchParams();
  if (billingCurrency) params.set("billing_currency", billingCurrency);
  if (statuses?.length) params.set("status", statuses.join(","));
  if (page !== undefined) {
    params.set("page", String(page));
    params.set("limit", "100");
  }
  const query = params.size ? `?${params.toString()}` : "";

  return request<undefined, IProjectConsultant[]>({
    url: `${API_ROUTES.PROJECT_CONSULTANTS}/${projectId}/consultants${query}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
