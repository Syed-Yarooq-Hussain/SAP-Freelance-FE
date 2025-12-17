import type { ApiResponse } from "@/types/api";
import type { IClientPaymentDTO } from "@/types/client";
import type { IConsultantPaymentDTO } from "@/types/consultant";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export async function fetchClientPayments(): Promise<
  ApiResponse<IClientPaymentDTO[]>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<undefined, IClientPaymentDTO[]>({
    url: API_ROUTES.CLIENT_PAYMENTS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function fetchConsultantPayments(): Promise<
  ApiResponse<IConsultantPaymentDTO[]>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  return await request<undefined, IConsultantPaymentDTO[]>({
    url: API_ROUTES.CONSULTANT_PAYMENTS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
