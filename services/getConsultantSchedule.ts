import { ApiCalendarResponse } from "@/types/calendar";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export const getConsultantSchedule = async (
  month: number,
  year: number
): Promise<ApiCalendarResponse> => {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const response = await request<void, ApiCalendarResponse>({
    url: API_ROUTES.GET_CONSULTANT_SCHEDULE,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params: { month, year },
  });

  if (!response.data) {
    throw new Error("Calendar data not found");
  }

  return response.data;
};
