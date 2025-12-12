import type { ConsultantStatus } from "@/constants/status";
import type { ApiResponse } from "@/types/api";
import { IProjectConsultant } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function getProjectConsultantsService(
  projectId: string | number,
  statuses: ConsultantStatus[]
): Promise<ApiResponse<IProjectConsultant[]>> {
  const session = await getCachedSession();
  const token = session?.accessToken;
  const query =
    statuses && statuses.length ? `?status=${statuses.join(",")}` : "";

  return request<undefined, IProjectConsultant[]>({
    url: `${API_ROUTES.PROJECT_CONSULTANTS}/${projectId}/consultants${query}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
