import type { ApiResponse } from "@/types/api";
import { IMeetingInviteResponse } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export interface IMeetingInviteBody {
  date_time: string;
  invitees_id: string[];
  duration: number;
  event_type: "interview";
}

export async function meetingInviteService(
  body: IMeetingInviteBody
): Promise<ApiResponse<IMeetingInviteResponse>> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<IMeetingInviteBody, IMeetingInviteResponse>({
    url: API_ROUTES.MEETING_INVITE,
    method: "POST",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
