import type { ApiResponse } from "@/types/api";
import type { IMilestone } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function getMilestoneTasksService(
  milestoneId: string | number
): Promise<ApiResponse<IMilestone>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return request<undefined, IMilestone>({
    url: `${API_ROUTES.GET_MILESTONE_TASKS}/${milestoneId}/tasks`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
