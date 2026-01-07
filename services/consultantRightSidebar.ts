import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export interface IConsultantRightSidebarResponse {
  skills: {
    primary_modules?: string;
    other_modules?: string;
    exp?: number;
    rate?: number;
  }[];
  engagements: {
    current: {
      project: string;
      employeer: string;
      project_info: string;
    };
    upcoming: {
      project: string;
      employeer: string;
      project_info: string;
    };
  };
}

export async function fetchConsultantRightSidebar(): Promise<
  ApiResponse<IConsultantRightSidebarResponse>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const res = await request<undefined, IConsultantRightSidebarResponse>({
    url: API_ROUTES.CONSULTANT_RIGHT_SIDEBAR,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to fetch sidebar data");
  }

  return res;
}
