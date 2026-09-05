import type { ApiResponse } from "@/types/api";
import { IUpdateConsultantStatusResponse } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export interface IUpdateConsultantStatusPayload {
  consultant_id: number | string;
  project_id: number | string;
  status: string;
  role: string;
  decided_rate?: number;
  requested_hours?: number;
}

export async function updateConsultantStatusService(
  body: IUpdateConsultantStatusPayload
): Promise<ApiResponse<IUpdateConsultantStatusResponse>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<
    IUpdateConsultantStatusPayload,
    IUpdateConsultantStatusResponse
  >({
    url: API_ROUTES.UPDATE_CONSULTANT_STATUS,
    method: "PUT",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
