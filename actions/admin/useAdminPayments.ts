"use client";

import { fetchAdminPayments } from "@/services/admin/adminPayments";
import type { IAdminPaymentsAggregate } from "@/types/adminPayments";
import { useQuery } from "@tanstack/react-query";

export const useAdminPayments = () =>
  useQuery<IAdminPaymentsAggregate, Error>({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const res = await fetchAdminPayments();
      if (res.status !== "success" || !res.data) {
        throw new Error(res.message || "Failed to load admin payments");
      }
      return res.data;
    },
  });