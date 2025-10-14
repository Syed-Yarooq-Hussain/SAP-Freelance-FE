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
import React, { useState } from "react";

interface FieldConfig {
  id: string;
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string | File) => void;
  helperText?: string;
}

interface DynamicPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields?: FieldConfig[];
  fileUpload?: boolean;
  fileValue?: File | null;
  onFileChange?: (file: File) => void;
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
  fields = [],
  fileUpload = false,
  fileValue = null,
  onFileChange,
  buttonText,
  buttonColor = "BLUE",
  onSubmit,
  description,
  noteText,
  disableSubmit = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(fileValue);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file && onFileChange) onFileChange(file);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { sx: { borderRadius: 2, p: 1 } },
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
        {fileUpload && (
          <Box
            sx={{
              border: "1px dashed #4680FF",
              borderRadius: 2,
              py: 4,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#f5faff",
              mb: 2,
              "&:hover": { bgcolor: "#e6f0ff" },
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              id="dynamic-popup-file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            <label htmlFor="dynamic-popup-file">
              <Typography variant="subtitle1" fontWeight="bold" color="#4680FF">
                {selectedFile ? selectedFile.name : "Select file"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to choose a file (.pdf, .doc, .docx)
              </Typography>
            </label>
          </Box>
        )}

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
          sx={{ width: "auto", px: 3, py: 0.8, fontWeight: 500 }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DynamicPopup;
