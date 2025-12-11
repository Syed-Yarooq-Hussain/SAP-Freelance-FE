import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type {
  IAddConsultantsPayload,
  IAddConsultantsResponse,
} from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function addConsultantsService(
  projectId: string | number,
  body: IAddConsultantsPayload[]
): Promise<ApiResponse<IAddConsultantsResponse[]>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const res = await request<
    IAddConsultantsPayload[],
    IAddConsultantsResponse[]
  >({
    url: `${API_ROUTES.SHORTLIST_CANDIDATES}/${projectId}/consultants`,
    method: "POST",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to add consultants to project");
  }

  return res;
}
