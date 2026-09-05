"use client";

import {
  addConsultantsService,
  removeConsultantService,
  syncConsultantsService,
} from "@/services/addConsultant";
import type { ApiResponse } from "@/types/api";
import type {
    IAddConsultantsPayload,
    IAddConsultantsResponse,
} from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useAddConsultants = () => {
  return useMutation<
    ApiResponse<IAddConsultantsResponse[]>,
    Error,
    { projectId: string | number; body: IAddConsultantsPayload[] }
  >({
    mutationFn: ({ projectId, body }) => addConsultantsService(projectId, body),
  });
};

export const useSyncConsultants = () =>
  useMutation<
    ApiResponse<IAddConsultantsResponse[]>,
    Error,
    { projectId: string | number; body: IAddConsultantsPayload[] }
  >({ mutationFn: ({ projectId, body }) => syncConsultantsService(projectId, body) });

export const useRemoveConsultant = () =>
  useMutation<
    ApiResponse<null>,
    Error,
    { projectId: string | number; consultantId: string | number }
  >({
    mutationFn: ({ projectId, consultantId }) =>
      removeConsultantService(projectId, consultantId),
  });
