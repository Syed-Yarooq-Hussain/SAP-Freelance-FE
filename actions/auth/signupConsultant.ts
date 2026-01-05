"use client";

import { Roles } from "@/constants/roles";
import { IConsultantSignupPayload } from "@/types/consultant";
import { API_ROUTES } from "@/utils/api_routes";
import { APP_ROUTES } from "@/utils/app_routes";
import { request } from "@/utils/request";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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

      await request<IConsultantSignupPayload, void>({
        url: API_ROUTES.SIGNUP_CONSULTANT,
        method: "POST",
        data,
      });
    },

    onSuccess: () => {
      router.push(APP_ROUTES.LOGIN);
    },
  });
};
