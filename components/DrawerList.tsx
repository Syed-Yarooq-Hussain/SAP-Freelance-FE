"use client";

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
import { FC } from "react";
import { usePathname } from "next/navigation";

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
  { icon: <DashboardIcon />, label: "Dashboard", link: "/dashboard" },
  { icon: <CalendarMonthIcon />, label: "Calendar", link: "/calendar" },
  { icon: <WorkIcon />, label: "Projects", link: "/dashboard/projects" },
  { icon: <DescriptionIcon />, label: "Documents", link: "/documents" },
  { icon: <PaymentIcon />, label: "Payments", link: "/payments" },
];

const DrawerList: FC<DrawerListProps> = ({ items = defaultItems, open }) => {
  const pathname = usePathname();

  return (
    <List>
      {items.map((item, index) => {
        const isActive = pathname === item.link;

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
