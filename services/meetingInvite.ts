import type { ApiResponse } from "@/types/api";
import {
  IMeetingInviteBody,
  IMeetingInviteResponse,
} from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function meetingInviteService(
  body: IMeetingInviteBody
): Promise<ApiResponse<IMeetingInviteResponse>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<IMeetingInviteBody, IMeetingInviteResponse>({
    url: API_ROUTES.MEETING_INVITE,
    method: "POST",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
