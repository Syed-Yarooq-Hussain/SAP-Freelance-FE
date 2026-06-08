"use client";

import {
  createConsultantHourLog,
  fetchConsultantHourLogs,
} from "@/services/consultantHourLogs";
import type { ApiResponse } from "@/types/api";
import type {
  IConsultantHourLog,
  ICreateHourLogPayload,
} from "@/types/consultant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const consultantHourLogsQueryKey = ["consultant", "hour-logs"];

export const useConsultantHourLogs = () =>
  useQuery<ApiResponse<IConsultantHourLog[]>, Error>({
    queryKey: consultantHourLogsQueryKey,
    queryFn: fetchConsultantHourLogs,
  });

export const useCreateConsultantHourLog = () =>
  useMutation<ApiResponse<IConsultantHourLog>, Error, ICreateHourLogPayload>({
    mutationFn: createConsultantHourLog,
  });
