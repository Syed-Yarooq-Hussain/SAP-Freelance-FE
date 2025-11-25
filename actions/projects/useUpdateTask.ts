"use client";

import { updateTaskService } from "@/services/updateTask";
import type { ApiResponse } from "@/types/api";
import type { ITask, IUpdateTaskPayload } from "@/types/teamBuilder";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTask = () => {
  return useMutation<
    ApiResponse<ITask>,
    Error,
    { taskId: string | number; body: IUpdateTaskPayload }
  >({
    mutationFn: ({ taskId, body }) => updateTaskService(taskId, body),
  });
};
