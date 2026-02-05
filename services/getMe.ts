import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type { IClientProjectDTO } from "@/types/client";
import { IConsultantProject } from "@/types/consultant";
import type { IProject, IProjectDetailsResponse } from "@/types/projects";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";
import { IUser } from "@/types/common-auth";

export const getMe = async (token:string): Promise<any> => {
  
    const response = await request<void, string>({
      url: API_ROUTES.GET_ME,
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  
    if (!response.data) {
      throw new Error("User Not found");
    }
  
    return response.data;
  };
  