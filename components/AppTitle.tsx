"use client";

import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const AppTitle: React.FC = () => {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname?.startsWith(APP_ROUTES.PAYMENTS)) return "Payments";
    if (pathname?.startsWith(APP_ROUTES.DOCUMENTS)) return "Documents";
    if (pathname?.startsWith(APP_ROUTES.PROJECTS)) return "Projects";
    if (pathname?.startsWith(APP_ROUTES.CALENDAR)) return "Calendar";
    if (pathname?.startsWith(APP_ROUTES.PROFILE)) return "Profile";
    if (pathname?.startsWith(APP_ROUTES.INTERVIEWS)) return "Interviews";
    if (pathname?.startsWith(APP_ROUTES.DASHBOARD)) return "Dashboard";
    return "App Title";
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
