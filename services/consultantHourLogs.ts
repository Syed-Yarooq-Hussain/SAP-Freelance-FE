import type {
  IConsultantHourLog,
  ICreateHourLogPayload,
} from "@/types/consultant";
import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

const authHeaders = async () => {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export async function fetchConsultantHourLogs(): Promise<
  ApiResponse<IConsultantHourLog[]>
> {
  return request<undefined, IConsultantHourLog[]>({
    url: API_ROUTES.CONSULTANT_HOUR_LOGS,
    method: "GET",
    headers: await authHeaders(),
  });
}

export async function createConsultantHourLog(
  body: ICreateHourLogPayload
): Promise<ApiResponse<IConsultantHourLog>> {
  return request<ICreateHourLogPayload, IConsultantHourLog>({
    url: API_ROUTES.CONSULTANT_HOUR_LOGS,
    method: "POST",
    data: body,
    headers: {
      ...(await authHeaders()),
      "Content-Type": "application/json",
    },
  });
}
