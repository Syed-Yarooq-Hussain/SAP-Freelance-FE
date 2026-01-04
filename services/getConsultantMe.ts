import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function getConsultantMeService() {
  const session = await getCachedSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Authorization token not found");
  }

  const res = await request<null, any>({
    url: API_ROUTES.CONSULTANT_ME,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to fetch consultant profile");
  }

  return res;
}
