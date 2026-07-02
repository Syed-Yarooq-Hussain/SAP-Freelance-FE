import { ApiResponse } from "@/types/api";
import { getCachedSession } from "./sessionCache";
import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";

interface IChangePassword{
    oldPassword?: string;
    newPassword: string;
}

export async function updatePassword(data: IChangePassword): Promise<ApiResponse<any>> {
    const session = await getCachedSession();
    const token = session?.accessToken;
    const res = await request<IChangePassword, any>({
      url: API_ROUTES.UPDATE_PASSWORD,
      method: "POST",
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (res.status !== "success") {
      throw new Error(res.message || "Failed to update password");
    }
  
    return res;
  }
