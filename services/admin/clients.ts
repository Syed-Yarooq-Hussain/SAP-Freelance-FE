import type { ApiResponse } from "@/types/api";
import type {
  AdminClientDTO,
  CreateAdminClientPayload,
  UpdateClientProfitMarginPayload,
} from "@/types/admin";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export type ClientStatus = "active" | "rejected" | "locked";

export async function fetchAdminClients(
  status: ClientStatus
): Promise<ApiResponse<AdminClientDTO[]>> {
  const res = await request<undefined, AdminClientDTO[]>({
    url: `${API_ROUTES.ADMIN_CLIENTS}?status=${status}`,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load clients");
  }

  const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];

  return { ...res, data };
}

export async function createAdminClient(
  payload: CreateAdminClientPayload
): Promise<ApiResponse<AdminClientDTO>> {
  return request<CreateAdminClientPayload, AdminClientDTO>({
    url: API_ROUTES.CREATE_ADMIN_CLIENT,
    method: "POST",
    data: payload,
  });
}

export async function updateClientProfitMargin({
  clientId,
  profitMarginPercentage,
}: UpdateClientProfitMarginPayload): Promise<ApiResponse<AdminClientDTO>> {
  return request<{ profit_margin_percentage: number }, AdminClientDTO>({
    url: API_ROUTES.UPDATE_ADMIN_CLIENT_PROFIT_MARGIN(clientId),
    method: "PUT",
    data: { profit_margin_percentage: profitMarginPercentage },
  });
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
