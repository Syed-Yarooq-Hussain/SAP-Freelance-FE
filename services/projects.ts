import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type { IClientProjectDTO } from "@/types/client";
import { IConsultantProject } from "@/types/consultant";
import type { IProject, IProjectDetailsResponse } from "@/types/projects";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function createProjectService(): Promise<ApiResponse<IProject>> {
  const session = await getCachedSession();
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

export async function fetchClientProjects(): Promise<
  ApiResponse<IClientProjectDTO[]>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const response = await request<undefined, IClientProjectDTO[]>({
    url: API_ROUTES.CLIENT_PROJECTS,
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (response.status === API_STATUS.ERROR) {
    throw new Error(response.message || "Failed to load client projects");
  }

  return response;
}

export async function fetchProjectDetails(
  projectId: string
): Promise<ApiResponse<IProjectDetailsResponse>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const response = await request<undefined, IProjectDetailsResponse>({
    url: `${API_ROUTES.GET_PROJECT_DETAILS}/${projectId}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status === API_STATUS.ERROR) {
    throw new Error(response.message || "Failed to load project details");
  }

  return response;
}

export async function fetchConsultantProjects(): Promise<
  ApiResponse<IConsultantProject[]>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const response = await request<undefined, IConsultantProject[]>({
    url: API_ROUTES.CONSULTANT_PROJECTS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status === API_STATUS.ERROR) {
    throw new Error(response.message || "Failed to load consultant projects");
  }

  return response;
}
