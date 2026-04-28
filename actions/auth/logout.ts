import { clearCachedSession } from "@/services/sessionCache";
import { useMutation } from "@tanstack/react-query";
import { APP_ROUTES } from "@/utils/app_routes";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      clearCachedSession();
      await signOut({
        redirect: true,
        callbackUrl: APP_ROUTES.LOGIN,
      });
    },
    onSuccess: () => {
      toast.success(`Logged out successfull`);
      console.log("Logout successful");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
