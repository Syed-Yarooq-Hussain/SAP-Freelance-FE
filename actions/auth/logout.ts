import { clearCachedSession } from "@/services/sessionCache";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/app_routes";
import { signOut } from "next-auth/react";
import { useToast } from "@/providers/ToastProvider";

export const useLogout = () => {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
      clearCachedSession();
    },
    onSuccess: () => {
      toast(`Logged out successfull`, "success");
      console.log("Logout successful");
      router.push(APP_ROUTES.HOME);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
