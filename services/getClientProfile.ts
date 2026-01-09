import { API_STATUS } from "@/constants/api_status";
import { getCachedSession } from "@/services/sessionCache";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function getClientMeService() {
  const session = await getCachedSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Authorization token not found");
  }

  const res = await request<null, any>({
    url: API_ROUTES.CLIENT_PROFILE,
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
