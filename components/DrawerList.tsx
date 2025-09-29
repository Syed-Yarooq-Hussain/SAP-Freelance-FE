"use client";

import { APP_ROUTES } from "@/utils/app_routes";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentIcon from "@mui/icons-material/Payment";
import WorkIcon from "@mui/icons-material/Work";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

type DrawerItem = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

type DrawerListProps = {
  items?: DrawerItem[];
  open: boolean;
};

const defaultItems: DrawerItem[] = [
  { icon: <DashboardIcon />, label: "Dashboard", link: APP_ROUTES.DASHBOARD },
  { icon: <CalendarMonthIcon />, label: "Calendar", link: APP_ROUTES.CALENDAR },
  { icon: <WorkIcon />, label: "Projects", link: APP_ROUTES.PROJECTS },
  { icon: <DescriptionIcon />, label: "Documents", link: APP_ROUTES.DOCUMENTS },
  { icon: <PaymentIcon />, label: "Payments", link: APP_ROUTES.PAYMENTS },
];

const DrawerList: FC<DrawerListProps> = ({ items = defaultItems, open }) => {
  const pathname = usePathname();

  return (
    <List>
      {items.map((item, index) => {
        const isActive =
          (pathname.startsWith(item.link)) &&
          !pathname.startsWith(item.link + "/");

        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              href={item.link}
              sx={{
                py: 1.5,
                px: 2,
                alignItems: "center",
                bgcolor: isActive ? "grey.200" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "grey.300" : "grey.100",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "primary.main" : "grey.700",
                  minWidth: 32,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : 500,
                    fontSize: 14,
                    color: isActive ? "primary.main" : "inherit",
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
