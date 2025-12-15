"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";

export interface DynamicModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onClose: () => void;
  width?: number | string;
}

export default function DynamicModal({
  open,
  title,
  children,
  actions,
  onClose,
  width = 450,
}: DynamicModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            width,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        {title}

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>
    </Dialog>
  );
}
