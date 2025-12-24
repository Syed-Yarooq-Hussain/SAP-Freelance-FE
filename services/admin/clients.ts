import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export type ClientStatus = "active" | "rejected" | "locked";

export async function fetchAdminClients(
  status: ClientStatus
): Promise<ApiResponse<any[]>> {
  const res = await request<undefined, any>({
    url: `${API_ROUTES.ADMIN_CLIENTS}?status=${status}`,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load clients");
  }

  const data = Array.isArray(res.data) ? res.data : [res.data];

  return { ...res, data };
}

export async function updateClientStatus(
  clientId: number,
  status: "active" | "rejected" | "locked"
): Promise<ApiResponse<null>> {
  return request({
    url: `${API_ROUTES.UPDATE_ADMIN_CLIENT_STATUS}/${clientId}`,
    method: "POST",
    data: { status },
  });
}
