import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

export interface UploadDocumentResponse {
  id: string;
  url: string;
  type: string;
  doc_id?: string;
}

export async function uploadDocument(
  file: File,
  documentType: string = "client_payment"
): Promise<ApiResponse<UploadDocumentResponse>> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", documentType);

  return await request<FormData, UploadDocumentResponse>({
    url: `${API_ROUTES.COMMON_UPLOAD}`,
    method: "POST",
    data: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
