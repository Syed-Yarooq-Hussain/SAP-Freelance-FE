"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { IConsultantSignupPayload } from "@/types/consultant";
import { useRouter } from "next/navigation";
import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import { API_ROUTES } from "@/utils/api_routes";

export const useSignupConsultant = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: IConsultantSignupPayload) => {
      if (data.user.role !== Roles.CONSULTANT) {
        throw new Error("Invalid role for consultant signup");
      }

      if (data.user.password !== data.user.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await request<IConsultantSignupPayload, void>({
        url: API_ROUTES.SIGNUP_CONSULTANT,
        method: "POST",
        data,
      });
      if (response.error) throw new Error(response.error.message);
      return response;
    },
    onSuccess(data) {
      console.log("Consultant signup successful:", data);
      router.push(APP_ROUTES.LOGIN);
    },
  });
};
