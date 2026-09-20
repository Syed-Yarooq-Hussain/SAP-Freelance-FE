import type { ApiResponse } from "@/types/api";
import type { IProjectPaymentDTO } from "@/types/teamBuilder";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export interface UpdatePaymentPayload {
  is_paid: boolean;
  doc_id?: string | number | null;
  payment_module: string;
}

export async function updatePaymentStatus(
  paymentId: string | number,
  payload: UpdatePaymentPayload
): Promise<ApiResponse<IProjectPaymentDTO>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<UpdatePaymentPayload, IProjectPaymentDTO>({
    url: `${API_ROUTES.GET_PROJECT_PAYMENTS}/payments/${paymentId}`,
    method: "PUT",
    data: payload,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
