import { getCachedSession } from "@/services/sessionCache";
import type { ApiResponse } from "@/types/api";
import type { IClientMeetingDTO } from "@/types/client";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function fetchClientMeetings(): Promise<
  ApiResponse<IClientMeetingDTO[]>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<undefined, IClientMeetingDTO[]>({
    url: API_ROUTES.CLIENT_MEETINGS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function fetchMeetingStatus(): Promise<ApiResponse<string[]>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<undefined, string[]>({
    url: API_ROUTES.MEETING_STATUS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function updateMeetingStatusService(
  meetingId: number | string,
  payload: {
    status: string;
    date_time?: string;
  }
): Promise<ApiResponse<IClientMeetingDTO>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<
    { status: string; date_time?: string },
    IClientMeetingDTO
  >({
    url: `${API_ROUTES.CLIENT_MEETINGS}/${meetingId}/status`,
    method: "PATCH",
    data: payload,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
