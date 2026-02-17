"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";

export const useSendVerificationEmail = () => {

  return useMutation({
    mutationFn: async (data: {userId: number}) => {
      if (!data?.userId) {
        throw new Error("Invalid User");
      }

      const response = await request<{userId: number | string}, void>({
        url: API_ROUTES.SEND_VERIFICATION_EMAIL,
        method: "POST",
        data,
      });
      return response;
    },
    onSuccess(data) {
      return data;
    },
  });
};
