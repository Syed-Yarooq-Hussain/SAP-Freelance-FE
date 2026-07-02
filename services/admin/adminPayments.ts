import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";
import type { ApiResponse } from "@/types/api";
import type { IAdminPaymentsAggregate } from "@/types/adminPayments";

export async function fetchAdminPayments(): Promise<
  ApiResponse<IAdminPaymentsAggregate>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return request<undefined, IAdminPaymentsAggregate>({
    url: API_ROUTES.ADMIN_PAYMENTS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
