"use client";

import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import colors from "@/utils/styles/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonthIconOutline from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessTimeIconOutline from "@mui/icons-material/AccessTimeOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardIconOutline from "@mui/icons-material/DashboardOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import DescriptionIconOutline from "@mui/icons-material/DescriptionOutlined";

import EventNoteIcon from "@mui/icons-material/EventNote";
import EventNoteIconOutline from "@mui/icons-material/EventNoteOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsIconOutline from "@mui/icons-material/NotificationsOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentIconOutline from "@mui/icons-material/PaymentOutlined";
import ProfileIcon from "@mui/icons-material/Person";
import ProfileIconOutline from "@mui/icons-material/PersonOutlined";
import WorkIcon from "@mui/icons-material/Work";
import WorkIconOutline from "@mui/icons-material/WorkOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupsIconOutline from "@mui/icons-material/GroupsOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccountTreeIconOutline from "@mui/icons-material/AccountTreeOutlined";
import FactoryIcon from "@mui/icons-material/Factory";
import FactoryIconOutline from "@mui/icons-material/FactoryOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import BusinessIconOutline from "@mui/icons-material/BusinessOutlined";
import PaidIcon from "@mui/icons-material/Paid";
import PaidIconOutline from "@mui/icons-material/PaidOutlined";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useMemo } from "react";
import DrawerListSkeleton from "./DrawerListSkeleton";
import { isNavLinkLocked, useOnboarding } from "@/providers/OnboardingProvider";
import { useOnboardingNavClick } from "@/hooks/useOnboardingNavClick";



// import { useToast } from "@/providers/ToastProvider";

type DrawerItem = {
  icon: React.ReactNode;
  outlined: React.ReactNode;
  label: string;
  link: string;
};

type DrawerListProps = {
  open: boolean;
};

const DrawerList: FC<DrawerListProps> = ({ open }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { status: onboardingStatus, currentStep } = useOnboarding();
  const handleOnboardingNavClick = useOnboardingNavClick();
  const role = session?.user?.role;
  const items: DrawerItem[] = useMemo(() => {
    if (!role) return [];
    if (role === Roles.ADMIN) {
      const r = APP_ROUTES.ADMIN;

      return [
        { icon: <DashboardIcon />, outlined: <DashboardIconOutline />, label: "Dashboard", link: r.DASHBOARD },
        { icon: <ProfileIcon />, outlined: <ProfileIconOutline />, label: "Profile", link: r.PROFILE },
        { icon: <GroupsIcon />, outlined: <GroupsIconOutline />, label: "Consultants", link: r.CONSULTANTS },
        { icon: <AccountTreeIcon />, outlined: <AccountTreeIconOutline />, label: "Modules", link: r.MODULES },
        { icon: <FactoryIcon />, outlined: <FactoryIconOutline />, label: "Industries", link: r.INDUSTRIES },
        { icon: <BusinessIcon />, outlined: <BusinessIconOutline />, label: "Clients", link: r.CLIENT },
        { icon: <WorkIcon />, outlined: <WorkIconOutline />, label: "Projects", link: r.PROJECTS },
        { icon: <EventNoteIcon />, outlined: <EventNoteIconOutline />, label: "Meetings", link: r.INTERVIEWS },
        { icon: <PaymentIcon />, outlined: <PaymentIconOutline />, label: "Payments", link: r.PAYMENTS },
        { icon: <PaidIcon />, outlined: <PaidIconOutline />, label: "Consultant Payments", link: r.CONSULTANT_PAYMENTS },
        { icon: <NotificationsIcon />, outlined: <NotificationsIconOutline />, label: "Notifications", link: r.NOTIFICATIONS },
      ];
    }

    if (role === Roles.CLIENT) {
      const r = APP_ROUTES.CLIENT;

      return [
        { icon: <DashboardIcon />, outlined: <DashboardIconOutline />, label: "Dashboard", link: r.DASHBOARD },
        { icon: <ProfileIcon />, outlined: <ProfileIconOutline />, label: "Profile", link: r.PROFILE },
        { icon: <WorkIcon />, outlined: <WorkIconOutline />, label: "Projects", link: r.PROJECTS },
        { icon: <EventNoteIcon />, outlined: <EventNoteIconOutline />, label: "Meetings", link: r.INTERVIEWS },
        { icon: <DescriptionIcon />, outlined: <DescriptionIconOutline />, label: "Documents", link: r.DOCUMENTS },
        { icon: <PaymentIcon />, outlined: <PaymentIconOutline />, label: "Payments", link: r.PAYMENTS },
      ];
    }

    const r = APP_ROUTES.CONSULTANT;

    return [
      { icon: <DashboardIcon />, outlined: <DashboardIconOutline />, label: "Dashboard", link: r.DASHBOARD },
      { icon: <ProfileIcon />, outlined: <ProfileIconOutline />, label: "Profile", link: r.PROFILE },
      { icon: <CalendarMonthIcon />, outlined: <CalendarMonthIconOutline />, label: "Calendar", link: r.CALENDAR },
      // { icon: <WorkIcon />, label: "Projects", link: r.PROJECTS },
      // { icon: <EventNoteIcon />, label: "Meetings", link: r.INTERVIEWS },
      { icon: <DescriptionIcon />, outlined: <DescriptionIconOutline />, label: "Documents", link: r.DOCUMENTS },
      // { icon: <AccessTimeIcon />, outlined: <AccessTimeIconOutline />, label: "Hour Logs", link: r.HOUR_LOGS },
      { icon: <PaymentIcon />, outlined: <PaymentIconOutline />, label: "Payments", link: r.PAYMENTS },
    ];
  }, [role]);

  if (status === "loading") {
    return <DrawerListSkeleton />;
  }

  return (
    <List>
      {items.map((item) => {
        const isActive =
          pathname === item.link || pathname.startsWith(`${item.link}/`);
        const locked = isNavLinkLocked(
          item.link,
          onboardingStatus,
          currentStep,
        );
        const tourId =
          item.link === APP_ROUTES.CONSULTANT.DASHBOARD
            ? "nav-dashboard"
            : item.link === APP_ROUTES.CONSULTANT.PROFILE
              ? "nav-profile"
              : item.link === APP_ROUTES.CONSULTANT.CALENDAR
                ? "nav-calendar"
                : undefined;

        return (
          <ListItem key={item.link} disablePadding>
            <ListItemButton
              component={locked ? "div" : Link}
              href={locked ? undefined : item.link}
              data-tour={tourId}
              aria-disabled={locked ? true : undefined}
              onClick={(event: React.MouseEvent) => {
                if (locked) {
                  event.preventDefault();
                  return;
                }
                void handleOnboardingNavClick(event, item.link);
              }}
              sx={{
                py: 1.5,
                px: 2,
                m: 1,
                borderRadius: 2,
                bgcolor: isActive ? '#4A7AB5' : "transparent",
                color: isActive ? "#fff" : '#4A7AB5',
                opacity: locked ? 0.4 : 1,
                cursor: locked ? "not-allowed" : "pointer",
                "&:hover": {
                  // bgcolor: isActive ? "#14394D" : alpha(colors.BLUE, 0.12),
                  bgcolor: isActive ? "#4A7AB5" : alpha('#4A7AB5', 0.12),
                  color: isActive ? "#fff" : '#4A7AB5',
                },
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                },
                "& .MuiListItemText-root, & .MuiListItemText-root .MuiTypography-root": {
                  color: "inherit",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  ml: -1,
                  color: "inherit",
                }}
              >
                {!isActive ? item.outlined : item.icon}
              </ListItemIcon>

              {open && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    color: "inherit",
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
