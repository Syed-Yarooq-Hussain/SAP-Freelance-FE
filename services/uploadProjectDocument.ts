import { getCachedSession } from "@/services/sessionCache";
import type { ApiResponse } from "@/types/api";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

export interface UploadProjectDocumentPayload {
  file: File;
  projectId: string | number;
  userId: string | number;
  type: string;
}

export interface UploadProjectDocumentResponse {
  id?: string | number;
  url?: string;
  type?: string;
  doc_id?: string | number;
}

export async function uploadProjectDocument({
  file,
  projectId,
  userId,
  type,
}: UploadProjectDocumentPayload): Promise<
  ApiResponse<UploadProjectDocumentResponse>
> {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", String(projectId));
  formData.append("user_id", String(userId));
  formData.append("type", type);

  return await request<FormData, UploadProjectDocumentResponse>({
    url: API_ROUTES.PROJECT_DOCUMENT_UPLOAD,
    method: "POST",
    data: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
