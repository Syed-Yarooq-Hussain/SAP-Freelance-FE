import { ILoginForm } from "@/types/common-auth";
import { APP_ROUTES } from "@/utils/app_routes";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    async onSuccess() {
      const session = await getSession();
      const role = session?.user?.role;

      if (!role) {
        router.push(APP_ROUTES.LOGIN);
        return;
      }

      switch (role) {
        case 1:
          router.push(APP_ROUTES.CLIENT.DASHBOARD);
          break;
        case 2:
          router.push(APP_ROUTES.CONSULTANT.DASHBOARD);
          break;
        case 3:
          router.push(APP_ROUTES.ADMIN.DASHBOARD);
          break;
        default:
          router.push(APP_ROUTES.HOME);
      }
    },
  });
};
