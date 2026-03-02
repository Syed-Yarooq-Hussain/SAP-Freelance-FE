import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "../sessionCache";

export async function parseCVViaAPI(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const session = await getCachedSession();
  const token = session?.accessToken;
  const res = await request<FormData, any>({
    url: API_ROUTES.PDF_READER,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}`: undefined,
    },
  });

  if (res.status !== "success") {
    throw new Error(res.message || "CV parsing failed");
  }

  return res.data;
}
