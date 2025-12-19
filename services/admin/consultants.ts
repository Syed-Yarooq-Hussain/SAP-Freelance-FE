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
