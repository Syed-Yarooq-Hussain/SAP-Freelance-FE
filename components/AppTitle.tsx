"use client";

import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const AppTitle: React.FC = () => {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/consultant")) {
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PROJECTS))
        return "Projects";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.INTERVIEWS))
        return "Interviews";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.DOCUMENTS))
        return "Documents";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PAYMENTS))
        return "Payments";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PROFILE)) return "Profile";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.CALENDAR))
        return "Calendar";
      return "Dashboard";
    }

    if (pathname.startsWith("/client")) {
      if (pathname.startsWith(APP_ROUTES.CLIENT.PROJECTS)) return "Projects";
      if (pathname.startsWith(APP_ROUTES.CLIENT.INTERVIEWS))
        return "Interviews";
      if (pathname.startsWith(APP_ROUTES.CLIENT.DOCUMENTS)) return "Documents";
      if (pathname.startsWith(APP_ROUTES.CLIENT.PAYMENTS)) return "Payments";
      if (pathname.startsWith(APP_ROUTES.CLIENT.PROFILE)) return "Profile";
      if (pathname.startsWith(APP_ROUTES.CLIENT.CONSULTANT))
        return "Consultant";
      return "Dashboard";
    }

    if (pathname.startsWith("/admin")) {
      if (pathname.startsWith(APP_ROUTES.ADMIN.PROJECTS)) return "Projects";
      if (pathname.startsWith(APP_ROUTES.ADMIN.INTERVIEWS)) return "Interviews";
      if (pathname.startsWith(APP_ROUTES.ADMIN.PAYMENTS)) return "Payments";
      if (pathname.startsWith(APP_ROUTES.ADMIN.PROFILE)) return "Profile";
      if (pathname.startsWith(APP_ROUTES.ADMIN.CONSULTANTS))
        return "Consultants";
      if (pathname.startsWith(APP_ROUTES.ADMIN.CLIENT)) return "Client";
      return "Dashboard";
    }

    if (pathname.startsWith(APP_ROUTES.TEAMBUILDER)) return "Team Builder";

    return "SAP Portal";
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="h6" noWrap component="div">
        {getTitle()}
      </Typography>
    </Box>
  );
};

export default AppTitle;
