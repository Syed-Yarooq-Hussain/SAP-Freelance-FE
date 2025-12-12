import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/app_routes";
import { signOut } from "next-auth/react";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      console.log("Logout successful");
      router.push(APP_ROUTES.HOME);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
