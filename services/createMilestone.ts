import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import { ICreateMilestonePayload, IMilestone } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function createMilestoneService(
  projectId: string | number,
  body: ICreateMilestonePayload
): Promise<ApiResponse<IMilestone>> {
  const session = await getSession();
  const token = session?.accessToken;

  const res = await request<ICreateMilestonePayload, IMilestone>({
    url: `${API_ROUTES.MILESTONE_CREATE}/${projectId}/milestones`,
    method: "POST",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to create milestone");
  }

  return res;
}
