import type {
  IAdminConsultantPayment,
  IMarkConsultantPaymentPaidPayload,
} from "@/types/adminConsultantPayments";
import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

const authHeaders = async () => {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export async function fetchAdminConsultantPayments(): Promise<
  ApiResponse<IAdminConsultantPayment[]>
> {
  return request<undefined, IAdminConsultantPayment[]>({
    url: API_ROUTES.ADMIN_CONSULTANT_PAYMENTS,
    method: "GET",
    headers: await authHeaders(),
  });
}

export async function fetchAdminConsultantPayment(
  userId: string | number
): Promise<ApiResponse<IAdminConsultantPayment[]>> {
  return request<undefined, IAdminConsultantPayment[]>({
    url: `${API_ROUTES.ADMIN_CONSULTANT_PAYMENT}/${userId}`,
    method: "GET",
    headers: await authHeaders(),
  });
}

export async function markAdminConsultantPaymentPaid(
  paymentId: string | number,
  body: IMarkConsultantPaymentPaidPayload
): Promise<ApiResponse<IAdminConsultantPayment>> {
  return request<IMarkConsultantPaymentPaidPayload, IAdminConsultantPayment>({
    url: `${API_ROUTES.ADMIN_CONSULTANT_PAYMENT}/${paymentId}/paid`,
    method: "PATCH",
    data: body,
    headers: {
      ...(await authHeaders()),
      "Content-Type": "application/json",
    },
  });
}
