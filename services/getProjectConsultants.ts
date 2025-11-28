import type { ApiResponse } from "@/types/api";
import { IProjectConsultant } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function getProjectConsultantsService(
  projectId: string | number
): Promise<ApiResponse<IProjectConsultant[]>> {
  const session = await getSession();
  const token = session?.accessToken;

  return request<undefined, IProjectConsultant[]>({
    url: `${API_ROUTES.PROJECT_CONSULTANTS}/${projectId}/consultants`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
