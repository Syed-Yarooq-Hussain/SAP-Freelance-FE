"use client";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";

type Props = {
  open?: boolean;
};

export default function DrawerListSkeleton({ open = true }: Props) {
  return (
    <List sx={{ px: 1 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <ListItem key={i} disablePadding>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              animation="wave"
            />
          </ListItemIcon>

          {open && (
            <ListItemText
              primary={
                <Skeleton
                  animation="wave"
                  height={18}
                  width="70%"
                  sx={{ borderRadius: 1 }}
                />
              }
            />
          )}
        </ListItem>
      ))}
    </List>
  );
}
