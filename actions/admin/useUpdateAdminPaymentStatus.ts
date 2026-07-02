"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentStatus } from "@/services/admin/updatePaymentStatus";
import type { IClientPaymentDTO } from "@/types/client";
import type { IAdminConsultantMonthlyBill } from "@/types/adminPayments";

interface UpdatePaymentStatusParams {
  payment: IClientPaymentDTO | IAdminConsultantMonthlyBill;
  paymentType: "client" | "consultant";
  docId?: string | null;
}

export const useUpdateAdminPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdatePaymentStatusParams) => {
      const isClientPayment = params.paymentType === "client";
      const paymentId = isClientPayment
        ? (params.payment as IClientPaymentDTO).id
        : (params.payment as IAdminConsultantMonthlyBill).id;

      return updatePaymentStatus({
        paymentId,
        paymentType: params.paymentType,
        docId: params.docId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "payments"],
      });
    },
  });
};
