"use client";

import { Roles } from "@/constants/roles";
import { IConsultantSignupPayload } from "@/types/consultant";
import { API_ROUTES } from "@/utils/api_routes";
import { APP_ROUTES } from "@/utils/app_routes";
import { request } from "@/utils/request";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ISignupDTO } from "@/types/common-auth";

export const useSignupConsultant = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ISignupDTO) => {
      const response = await request<ISignupDTO, any>({
        url: API_ROUTES.SIGNUP_CONSULTANT,
        method: "POST",
        data,
      });

      return response; // 👈 IMPORTANT
    },
  });
};
