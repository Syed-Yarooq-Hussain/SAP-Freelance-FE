import type { ApiResponse } from "@/types/api";
import type { IConsultantUser } from "@/types/consultant";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export async function fetchClientConsultants(): Promise<
  ApiResponse<IConsultantUser[]>
> {
  const res = await request<undefined, IConsultantUser[]>({
    url: API_ROUTES.CLIENT_CONSULTANTS,
    method: "GET",
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Failed to load consultants");
  }

  return res;
}
