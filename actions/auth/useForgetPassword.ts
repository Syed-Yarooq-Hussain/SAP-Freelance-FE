"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";

export const useForgetPassword = () => {

  return useMutation({
    mutationFn: async (data: {email:string}) => {
      const response = await request<{email:string}, any>({
        url: API_ROUTES.FORGOT_PASSWORD,
        method: "POST",
        data,
      });
      return response;
    },
    onSuccess(data) {
      console.log("Consultant send Forget Password Email:", data);
      return data;
    },
  });
};
