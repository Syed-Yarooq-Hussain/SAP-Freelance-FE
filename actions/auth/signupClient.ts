"use client";

import { request } from "@/utils/request";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/utils/api_routes";
import { APP_ROUTES } from "@/utils/app_routes";
import { Roles } from "@/constants/roles";
import { IBaseSignupDTO } from "@/types/commonauth";

export const useSignupClient = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: IBaseSignupDTO) => {
      if (data.role !== Roles.CLIENT) {
        throw new Error("Invalid role for client signup");
      }
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await request<IBaseSignupDTO, void>({
        url: API_ROUTES.SIGNUP_CLIENT,
        method: "POST",
        data,
      });
      if (response.error) throw new Error(response.error.message);

      return response;
    },
    onSuccess(data) {
      console.log("Client signup successful:", data);
      router.push(APP_ROUTES.LOGIN);
    },
  });
};
