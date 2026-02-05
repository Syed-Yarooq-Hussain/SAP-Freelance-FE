"use client";

import { useMutation } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { IConsultantSignupPayload } from "@/types/consultant";
import { useRouter } from "next/navigation";
import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import { API_ROUTES } from "@/utils/api_routes";
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
      return response;
    },
    onSuccess(data) {
      console.log("Consultant signup successful:", data);
      return data;
    },
  });
};
