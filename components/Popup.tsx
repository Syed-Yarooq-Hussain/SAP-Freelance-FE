"use client";

import AppButton from "@/components/Button";
import { colors } from "@/utils/styles/colors";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

interface FieldConfig {
  id: string;
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  helperText?: string;
}

interface DynamicPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  buttonText: string;
  buttonColor?: keyof typeof colors;
  onSubmit: () => void;
  description?: string;
  noteText?: string;
  disableSubmit?: boolean;
}

const DynamicPopup: React.FC<DynamicPopupProps> = ({
  open,
  onClose,
  title,
  fields,
  buttonText,
  buttonColor = "BLUE",
  onSubmit,
  description,
  noteText,
  disableSubmit = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: { borderRadius: 2, p: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mb={2}
          sx={{ fontWeight: "bold" }}
        >
          {description}
        </Typography>
      )}

      <DialogContent sx={{ pt: 1, pb: 0 }}>
        {fields.map((field) => (
          <Box key={field.id} mb={2}>
            <TextField
              fullWidth
              label={field.label}
              type={field.type || "text"}
              placeholder={field.placeholder || ""}
              value={field.value || ""}
              onChange={(e) => field.onChange?.(e.target.value)}
              size="small"
              multiline={field.type !== "date" && field.type !== "time"}
              minRows={3}
              slotProps={{
                inputLabel: {
                  shrink: field.type === "date" || field.type === "time",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#f8f9fc",
                  borderRadius: 1,
                },
              }}
              helperText={field.helperText}
            />
          </Box>
        ))}
      </DialogContent>

      <DialogActions
        sx={{ flexDirection: "column", alignItems: "center", pb: 2, gap: 1 }}
      >
        {noteText && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {noteText}
          </Typography>
        )}

        <AppButton
          label={buttonText}
          colorKey={buttonColor}
          onClick={onSubmit}
          disabled={disableSubmit}
          sx={{
            width: "auto",
            px: 3,
            py: 0.8,
            fontWeight: 500,
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DynamicPopup;
