import { API_STATUS } from "@/constants/api_status";
import type { ApiResponse } from "@/types/api";
import type { ITask, IUpdateTaskPayload } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function updateTaskService(
  taskId: string | number,
  body: IUpdateTaskPayload
): Promise<ApiResponse<ITask>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const res = await request<IUpdateTaskPayload, ITask>({
    url: `${API_ROUTES.UPDATE_TASKS}/${taskId}`,
    method: "PUT",
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Task update failed");
  }

  return res;
}
