"use client";

import { createTaskService } from "@/services/createTask";
import type { ApiResponse } from "@/types/api";
import type { ICreateTaskPayload, ITask } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useCreateTask = () => {
  return useMutation<
    ApiResponse<ITask>,
    Error,
    { milestoneId: string | number; body: ICreateTaskPayload }
  >({
    mutationFn: ({ milestoneId, body }) => createTaskService(milestoneId, body),
  });
};
