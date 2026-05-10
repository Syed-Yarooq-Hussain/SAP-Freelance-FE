import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";
import { getCachedSession } from "@/services/sessionCache";

interface UpdatePaymentParams {
  paymentId: string | number;
  paymentType: "client" | "consultant";
  docId?: string | null;
}

export async function updatePaymentStatus(params: UpdatePaymentParams) {
  const session = await getCachedSession();
  const token = session?.accessToken;

  const payload: any = {
    is_paid: true,
  };

  // For client payments, use doc_id; for consultant, use pdf_url
  if (params.docId) {
    if (params.paymentType === "client") {
      payload.doc_id = params.docId;
    } else {
      payload.pdf_url = params.docId;
    }
  }

  return request({
    url: `${API_ROUTES.ADMIN_PAYMENTS}/${params.paymentId}`,
    method: "PUT",
    data: {
      ...payload,
      payment_type: params.paymentType,
    },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
