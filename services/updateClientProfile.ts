import { API_STATUS } from "@/constants/api_status";
import { getCachedSession } from "@/services/sessionCache";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function updateClientProfileService(body: {
  username: string;
  email: string;
  city: string;
  country: string;
  phone: string;
}) {
  const session = await getCachedSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Authorization token not found");
  }

  const res = await request<typeof body, any>({
    url: API_ROUTES.UPDATE_CLIENT_PROFILE,
    method: "PUT",
    data: body, // ✅ direct body
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to update client profile");
  }

  return res;
}
