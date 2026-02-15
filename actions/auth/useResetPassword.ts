"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";

interface IResetPasswordPayload {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export const useResetPassword = () => {

  return useMutation({
    mutationFn: async (data: IResetPasswordPayload) => {
      const response = await request<IResetPasswordPayload, any>({
        url: API_ROUTES.RESET_PASSWORD,
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
