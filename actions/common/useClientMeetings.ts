"use client";

import {
  fetchClientMeetings,
  fetchMeetingStatus,
  updateMeetingStatusService,
} from "@/services/meetings";
import type { ApiResponse } from "@/types/api";
import type { IClientMeetingDTO } from "@/types/client";
import { useMutation } from "@tanstack/react-query";

export function useClientMeetings() {
  return useMutation<ApiResponse<IClientMeetingDTO[]>, Error>({
    mutationFn: fetchClientMeetings,
  });
}

export const useClientMeetingStatus = () => {
  return useMutation<ApiResponse<string[]>, Error>({
    mutationFn: fetchMeetingStatus,
  });
};

export function useUpdateMeetingStatus() {
  return useMutation<
    ApiResponse<IClientMeetingDTO>,
    Error,
    { meetingId: number | string; status: string }
  >({
    mutationFn: ({ meetingId, status }) =>
      updateMeetingStatusService(meetingId, status),
  });
}
