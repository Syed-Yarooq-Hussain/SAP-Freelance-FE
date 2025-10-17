"use client";

import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import colors from "@/utils/styles/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import ProfileIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useMemo } from "react";

type DrawerItem = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

type DrawerListProps = {
  open: boolean;
};

type RoleRoutes = {
  DASHBOARD: string;
  PROFILE?: string;
  INTERVIEWS?: string;
  PROJECTS?: string;
  DOCUMENTS?: string;
  PAYMENTS?: string;
  CALENDAR?: string;
  CONSULTANT?: string;
};

const DrawerList: FC<DrawerListProps> = ({ open }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const items: DrawerItem[] = useMemo(() => {
    if (!role) return [];

    const routeSet: RoleRoutes =
      role === Roles.CLIENT
        ? APP_ROUTES.CLIENT
        : role === Roles.CONSULTANT
        ? APP_ROUTES.CONSULTANT
        : APP_ROUTES.ADMIN;

    const baseItems: DrawerItem[] = [
      {
        icon: <DashboardIcon />,
        label: "Dashboard",
        link: routeSet.DASHBOARD,
      },
      {
        icon: <ProfileIcon />,
        label: "Profile",
        link: routeSet.PROFILE || "#",
      },
    ];

    if (role === Roles.CLIENT && routeSet.CONSULTANT) {
      baseItems.push({
        icon: <PeopleIcon />,
        label: "Consultant",
        link: routeSet.CONSULTANT,
      });
    } else if (role === Roles.CONSULTANT && routeSet.CALENDAR) {
      baseItems.push({
        icon: <CalendarMonthIcon />,
        label: "Calendar",
        link: routeSet.CALENDAR,
      });
    }

    baseItems.push(
      {
        icon: <EventNoteIcon />,
        label: "Interviews",
        link: routeSet.INTERVIEWS || "#",
      },
      {
        icon: <WorkIcon />,
        label: "Projects",
        link: routeSet.PROJECTS || "#",
      },
      {
        icon: <DescriptionIcon />,
        label: "Documents",
        link: routeSet.DOCUMENTS || "#",
      },
      {
        icon: <PaymentIcon />,
        label: "Payments",
        link: routeSet.PAYMENTS || "#",
      }
    );

    return baseItems;
  }, [role]);

  return (
    <List>
      {items.map((item, index) => {
        const isActive =
          pathname === item.link || pathname.startsWith(`${item.link}/`);

        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              href={item.link}
              sx={{
                py: 1.5,
                px: 2,
                alignItems: "center",
                bgcolor: isActive ? "#F2F3F7" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "grey.300" : "grey.100",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? colors.BLUE : "grey.700",
                  minWidth: 32,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: isActive ? "bold" : 500,
                        fontSize: 14,
                        color: isActive ? "primary.main" : "inherit",
                      },
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default DrawerList;
