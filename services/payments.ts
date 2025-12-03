import type { ApiResponse } from "@/types/api";
import type { IClientPaymentDTO } from "@/types/client";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getSession } from "next-auth/react";

export async function fetchClientPayments(): Promise<
  ApiResponse<IClientPaymentDTO[]>
> {
  const session = await getSession();
  const token = session?.accessToken;

  return await request<undefined, IClientPaymentDTO[]>({
    url: API_ROUTES.CLIENT_PAYMENTS,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
