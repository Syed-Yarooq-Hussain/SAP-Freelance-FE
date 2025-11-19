import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { API_STATUS } from "@/constants/api_status";
import type { IProject } from "@/types/projects";
import type { ApiResponse } from "@/types/api";
import { getSession } from "next-auth/react";

export async function createProjectService(): Promise<ApiResponse<IProject>> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await request<undefined, IProject>({
    url: API_ROUTES.PROJECT_CREATE,
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (response.status === API_STATUS.ERROR) {
    throw new Error(response.message || "Failed to create project");
  }

  return response;
}
