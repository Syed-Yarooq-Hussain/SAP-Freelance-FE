"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";

export const useVerifyToken = () => {

  return useMutation({
    mutationFn: async (data: {token: string}) => {
      if (!data?.token) {
        throw new Error("Invalid token provide");
      }

      const response = await request<{userId: number | string}, void>({
        url: API_ROUTES.VERIFY_EMAIL(data.token),
        method: "GET"
      });
      return response;
    },
    onSuccess(data) {
      console.log("Consultant verify token success:", data);
      return data;
    },
  });
};
