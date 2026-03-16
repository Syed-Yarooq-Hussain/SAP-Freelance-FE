import { API_STATUS } from "@/constants/api_status";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export const getConsultantDashboard = async (): Promise<any> => {
    const session = await getCachedSession();
    const token = session?.accessToken;
    const response = await request<void, string>({
      url: API_ROUTES.CONSULTANT_DASHBOARD,
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  
    if (response.status === API_STATUS.ERROR || !response.data) {
      const errorMessage = response.message || "Consultant Dashboard Not found";
      console.error("getMe error:", errorMessage, response);
      throw new Error(errorMessage);
    }
  
    return response.data;
  };
  