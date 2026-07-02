import { IAdminPendingConsultant } from "@/types/admin";
import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function fetchPendingConsultants(): Promise<
  ApiResponse<IAdminPendingConsultant[]>
> {
  const res = await request<undefined, IAdminPendingConsultant[]>({
    url: `${API_ROUTES.ADMIN_CONSULTANTS}?status=pending`,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load pending consultants");
  }

  return res;
}

export async function updateConsultantStatus(
  consultantId: number,
  status: "active" | "rejected" | "locked"
): Promise<ApiResponse<null>> {
  return request({
    url: `${API_ROUTES.UPDATE_ADMIN_CONSULTANT_STATUS}/${consultantId}`,
    method: "POST",
    data: { status },
  });
}

export type ConsultantStatus = "active" | "pending" | "locked";

function normalizeConsultantsResponse(data: unknown): any[] {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const possibleLists = [
      record.data,
      record.consultants,
      record.results,
      record.items,
    ];

    for (const list of possibleLists) {
      if (Array.isArray(list)) return list;
    }
  }

  return [];
}

export async function fetchAdminConsultants(
  status: ConsultantStatus
): Promise<ApiResponse<any[]>> {
  const res = await request<undefined, any>({
    url: `${API_ROUTES.ADMIN_CONSULTANTS}?status=${status}`,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load consultants");
  }
  const data = normalizeConsultantsResponse(res.data);

  return { ...res, data };
}
