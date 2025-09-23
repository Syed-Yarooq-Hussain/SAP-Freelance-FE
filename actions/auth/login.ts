import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/app_routes";
import { ILoginForm } from "@/types/common-auth";
import { signIn, SignInResponse } from "next-auth/react";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ILoginForm) => {
      const response = (await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })) as SignInResponse;

      if (response?.error) throw new Error(response.error);
      return response;
    },
    onSuccess(data) {
      console.log("Login successful:", data);
      router.push(APP_ROUTES.DASHBOARD);
    },
  });
};
