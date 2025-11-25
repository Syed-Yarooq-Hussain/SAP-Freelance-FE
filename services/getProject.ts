import type { ApiResponse } from "@/types/api";
import type { IProject } from "@/types/projects";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function getProjectService(
  id: string | number
): Promise<ApiResponse<IProject>> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<undefined, IProject>({
    url: `${API_ROUTES.UPDATE_PROJECT}/${id}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
