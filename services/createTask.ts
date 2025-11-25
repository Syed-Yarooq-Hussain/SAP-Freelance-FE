import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type { ICreateTaskPayload, ITask } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function createTaskService(
  milestoneId: string | number,
  body: ICreateTaskPayload
): Promise<ApiResponse<ITask>> {
  const session = await getSession();
  const token = session?.accessToken;

  const res = await request<ICreateTaskPayload, ITask>({
    url: `${API_ROUTES.MILESTONE_TASKS_CREATE}/${milestoneId}/tasks`,
    method: "POST",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to create task");
  }

  return res;
}
