import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";

export const getProfileRouteByRole = (role?: number) => {
  switch (role) {
    case Roles.CLIENT:
      return APP_ROUTES.CLIENT.PROFILE;
    case Roles.CONSULTANT:
      return APP_ROUTES.CONSULTANT.PROFILE;
    case Roles.ADMIN:
      return APP_ROUTES.ADMIN.PROFILE;
    default:
      return APP_ROUTES.HOME;
  }
};
