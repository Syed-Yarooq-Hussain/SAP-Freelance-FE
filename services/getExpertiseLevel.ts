import { ApiCalendarResponse } from "@/types/calendar";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export const getExpertiseLevels = async (
): Promise<any[]> => {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const response = await request<void, any[]>({
    url: API_ROUTES.GET_EXPERTISE_LEVELS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.data) {
    throw new Error("Expertise levels data not found");
  }

  return response.data;
};
