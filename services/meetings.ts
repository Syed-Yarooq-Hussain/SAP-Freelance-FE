import type { ApiResponse } from "@/types/api";
import type { IClientMeetingDTO } from "@/types/client";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function fetchClientMeetings(): Promise<
  ApiResponse<IClientMeetingDTO[]>
> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<undefined, IClientMeetingDTO[]>({
    url: API_ROUTES.CLIENT_MEETINGS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function fetchMeetingStatus(): Promise<ApiResponse<string[]>> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<undefined, string[]>({
    url: API_ROUTES.MEETING_STATUS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function updateMeetingStatusService(
  meetingId: number | string,
  status: string
): Promise<ApiResponse<IClientMeetingDTO>> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<{ status: string }, IClientMeetingDTO>({
    url: `${API_ROUTES.CLIENT_MEETINGS}/${meetingId}/status`,
    method: "PATCH",
    data: { status },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
