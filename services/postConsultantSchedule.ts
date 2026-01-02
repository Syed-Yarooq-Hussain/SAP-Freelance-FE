import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "./sessionCache";

export interface ConsultantSchedulePayload {
  custom?: {
    date: string;
    slot: { start: string; end: string }[];
    active: boolean;
  }[];
  weekly?: {
    day: string;
    slot?: { start: string; end: string }[];
    active: boolean;
  }[];
  events?: any[];
}

export const postConsultantSchedule = async (
  payload: ConsultantSchedulePayload
) => {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return request<ConsultantSchedulePayload, void>({
    url: API_ROUTES.POST_CONSULTANT_SCHEDULE,
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    data: payload,
  });
};
