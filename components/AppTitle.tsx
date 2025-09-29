"use client";

import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const AppTitle: React.FC = () => {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === APP_ROUTES.DASHBOARD) return "Dashboard";
    if (pathname === APP_ROUTES.CALENDAR) return "Calendar";
    if (pathname === APP_ROUTES.PROJECTS) return "Projects";
    if (pathname === APP_ROUTES.DOCUMENTS) return "Documents";
    if (pathname === APP_ROUTES.PAYMENTS) return "Payments";
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
