import { useToast } from "@/providers/ToastProvider";
import { getCachedSession } from "@/services/sessionCache";
import { ILoginForm } from "@/types/common-auth";
import { APP_ROUTES } from "@/utils/app_routes";
import { useMutation } from "@tanstack/react-query";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ILoginForm) => {
      const response = (await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })) as SignInResponse;

      // NextAuth returns generic error codes like "CredentialsSignin" or "Configuration"
      // Map them to a clear, user-friendly message (e.g. backend "Invalid credentials")
      if (response?.error) {
        let message = response.error;

        // These are the common generic codes we see from Credentials provider
        if (
          response.error === "CredentialsSignin" ||
          response.error === "Configuration"
        ) {
          message = "Invalid credentials";
        }

        throw new Error(message);
      }

      return response;
    },

    async onSuccess() {
      const session = await getCachedSession();
      const role = session?.user?.role;
      if (!role) {
        router.push(APP_ROUTES.LOGIN);
        return;
      }

      const roleLabel =
        role === 1 ? "Client": role === 2
          ? "Consultant" : role === 3
          ? "Admin" : "User";

      toast.success(`Logged in successfully as ${roleLabel}`);

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
