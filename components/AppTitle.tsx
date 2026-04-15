"use client";

import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AppTitle: React.FC = () => {
  const pathname = usePathname();

  const isTeamBuilder = pathname.startsWith(APP_ROUTES.TEAMBUILDER);

  const getTitle = () => {
    if (pathname.startsWith("/consultant")) {
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PROJECTS))
        return "Projects";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.INTERVIEWS))
        return "Meetings";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.DOCUMENTS))
        return "Documents";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PAYMENTS))
        return "Payments";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PROFILE)) return "Profile";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.CALENDAR))
        return "Calendar";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.ACCOUNT))
        return "Account Settings";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.PROFILE))
        return "Profile";
      if (pathname.startsWith(APP_ROUTES.CONSULTANT.CHANGE_PASSWORD))
        return "Change Password";
      return "Dashboard";
    }

    if (pathname.startsWith("/client")) {
      if (pathname.startsWith(APP_ROUTES.CLIENT.PROJECTS)) return "Projects";
      if (pathname.startsWith(APP_ROUTES.CLIENT.INTERVIEWS)) return "Meetings";
      if (pathname.startsWith(APP_ROUTES.CLIENT.DOCUMENTS)) return "Documents";
      if (pathname.startsWith(APP_ROUTES.CLIENT.PAYMENTS)) return "Payments";
      if (pathname.startsWith(APP_ROUTES.CLIENT.PROFILE)) return "Profile";
      if (pathname.startsWith(APP_ROUTES.CLIENT.CONSULTANT))
        return "Consultant";
      return "Dashboard";
    }

    if (pathname.startsWith("/admin")) {
      if (pathname.startsWith(APP_ROUTES.ADMIN.PROJECTS)) return "Projects";
      if (pathname.startsWith(APP_ROUTES.ADMIN.INTERVIEWS)) return "Meetings";
      if (pathname.startsWith(APP_ROUTES.ADMIN.PAYMENTS)) return "Payments";
      if (pathname.startsWith(APP_ROUTES.ADMIN.PROFILE)) return "Profile";
      if (pathname.startsWith(APP_ROUTES.ADMIN.CONSULTANTS))
        return "Consultant";
      if (pathname.startsWith(APP_ROUTES.ADMIN.MODULES)) return "Modules";
      if (pathname.startsWith(APP_ROUTES.ADMIN.INDUSTRIES)) return "Industries";
      if (pathname.startsWith(APP_ROUTES.ADMIN.CLIENT)) return "Clients";
      if (pathname.startsWith(APP_ROUTES.ADMIN.NOTIFICATIONS))
        return "Notifications";
      return "Dashboard";
    }

    if (isTeamBuilder) return "Team Builder";

    return "SAP Portal";
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {isTeamBuilder && (
        <Link
          href={APP_ROUTES.CLIENT.DASHBOARD}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Image
            src="/vx9-logo-02.png"
            alt="Vertex9 Systems"
            width={100}
            height={50}
            style={{
              objectFit: "contain",
              cursor: "pointer",
            }}
            priority
          />
        </Link>
      )}

      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: "1.35rem",
          color: "#1A1A1A",
          letterSpacing: "0.5px",
        }}
      >
        {getTitle()}
      </Typography>
    </Box>
  );
};

export default AppTitle;
