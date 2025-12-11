import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type { ICreateMilestonePayload, IMilestone } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function updateMilestoneService(
  milestoneId: string | number,
  body: ICreateMilestonePayload
): Promise<ApiResponse<IMilestone>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const res = await request<ICreateMilestonePayload, IMilestone>({
    url: `${API_ROUTES.UPDATE_MILESTONE}/${milestoneId}`,
    method: "PUT",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to update milestone");
  }

  return res;
}
