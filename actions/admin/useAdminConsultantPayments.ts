"use client";

import {
  fetchAdminConsultantPayment,
  fetchAdminConsultantPayments,
  markAdminConsultantPaymentPaid,
} from "@/services/admin/consultantPayments";
import type {
  IAdminConsultantPayment,
  IMarkConsultantPaymentPaidPayload,
} from "@/types/adminConsultantPayments";
import type { ApiResponse } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const adminConsultantPaymentsQueryKey = [
  "admin",
  "consultant-payments",
];

export const useAdminConsultantPayments = () =>
  useQuery<ApiResponse<IAdminConsultantPayment[]>, Error>({
    queryKey: adminConsultantPaymentsQueryKey,
    queryFn: fetchAdminConsultantPayments,
  });

export const useAdminConsultantPayment = (userId?: string | number) =>
  useQuery<ApiResponse<IAdminConsultantPayment[]>, Error>({
    queryKey: [...adminConsultantPaymentsQueryKey, userId],
    queryFn: () => fetchAdminConsultantPayment(userId!),
    enabled: Boolean(userId),
  });

export const useMarkAdminConsultantPaymentPaid = () =>
  useMutation<
    ApiResponse<IAdminConsultantPayment>,
    Error,
    { paymentId: string | number; body: IMarkConsultantPaymentPaidPayload }
  >({
    mutationFn: ({ paymentId, body }) =>
      markAdminConsultantPaymentPaid(paymentId, body),
  });
