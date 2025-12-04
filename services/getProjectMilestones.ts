import type { ApiResponse } from "@/types/api";
import type { IMilestone } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function getProjectMilestonesService(
  projectId: string | number
): Promise<ApiResponse<IMilestone[]>> {
  const session = await getSession();
  const token = session?.accessToken;

  return request<undefined, IMilestone[]>({
    url: `${API_ROUTES.GET_PROJECT_MILESTONE}/${projectId}/milestones`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
