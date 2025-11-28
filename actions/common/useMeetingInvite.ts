"use client";

import { meetingInviteService } from "@/services/meetingInvite";
import type { ApiResponse } from "@/types/api";
import type {
  IMeetingInviteBody,
  IMeetingInviteResponse,
} from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export function useMeetingInvite() {
  return useMutation<
    ApiResponse<IMeetingInviteResponse>,
    Error,
    IMeetingInviteBody
  >({
    mutationFn: (body) => meetingInviteService(body),
  });
}
