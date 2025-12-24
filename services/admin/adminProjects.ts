import type { ApiResponse } from "@/types/api";
import { IAdminProject } from "@/types/projects";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function fetchAdminProjects(): Promise<
  ApiResponse<IAdminProject[]>
> {
  const res = await request<undefined, IAdminProject[]>({
    url: API_ROUTES.ADMIN_PROJECTS,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load admin projects");
  }

  return res;
}
