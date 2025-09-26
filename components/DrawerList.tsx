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
  { icon: <WorkIcon />, label: "Projects", link: "/projects" },
  { icon: <DescriptionIcon />, label: "Documents", link: "/documents" },
  { icon: <PaymentIcon />, label: "Payments", link: "/payments" },
];

const DrawerList: FC<DrawerListProps> = ({ items = defaultItems, open }) => {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            component={Link}
            href={item.link}
            sx={{
              py: 1.5,
              px: 2,
              alignItems: "center",
            }}
          >
            <ListItemIcon sx={{ color: "grey.700", minWidth: 32 }}>
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
              />
            )}
          </ListItemButton>
        </ListItem>
      ))}
    </List>

  );
};

export default DrawerList;
