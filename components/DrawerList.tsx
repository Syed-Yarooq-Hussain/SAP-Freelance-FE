"use client";

import Link from "next/link";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FC } from "react";

type DrawerItem = {
  icon: React.ReactNode;
  label: string;
  link: string;
  onClick?: () => void;
};

type DrawerListProps = {
  items: DrawerItem[];
  open: boolean;
};

const DrawerList: FC<DrawerListProps> = ({ items, open }) => {
  return (
    <List dense={true}>
      {items.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton
            component={Link}
            href={item.link}
            onClick={item.onClick}
            sx={{
              width: "100%",
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText primary={item.label} sx={{ opacity: 1, ml: 2 }} />
            )}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default DrawerList;
