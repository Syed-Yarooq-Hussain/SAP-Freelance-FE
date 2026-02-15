"use client";

import { Roles } from "@/constants/roles";
import { IBaseSignupDTO } from "@/types/common-auth";
import { API_ROUTES } from "@/utils/api_routes";
import { APP_ROUTES } from "@/utils/app_routes";
import { request } from "@/utils/request";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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

      await request<IBaseSignupDTO, void>({
        url: API_ROUTES.SIGNUP_CLIENT,
        method: "POST",
        data,
      });
    },
    onSuccess() {
      router.push(APP_ROUTES.LOGIN);
    },
  });
};
