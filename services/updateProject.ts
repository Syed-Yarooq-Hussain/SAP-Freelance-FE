import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type { IProject } from "@/types/projects";
import { IUpdateProjectPayload } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function updateProjectService(
  projectId: string | number,
  body: IUpdateProjectPayload
): Promise<ApiResponse<IProject>> {
  const session = await getSession();
  const token = session?.accessToken;

  const res = await request<typeof body, IProject>({
    url: `${API_ROUTES.PROJECT_UPDATE}/${projectId}`,
    method: "PUT",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to update project");
  }

  return res;
}
