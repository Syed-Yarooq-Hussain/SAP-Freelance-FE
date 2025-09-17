"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { API_ROUTES } from "@/utils/api_routes";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/app_routes";
import { ILoginForm } from "@/types/commonauth";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ILoginForm) => {
      const response = await request<ILoginForm, void>({
        url: API_ROUTES.LOGIN,
        method: "POST",
        data,
      });
      if (response.error) throw new Error(response.error.message);
      return response;
    },
    onSuccess(data) {
      console.log("Login successful:", data);
      router.push(APP_ROUTES.DASHBOARD);
    },
  });
};
