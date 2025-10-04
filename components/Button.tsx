"use client";

import * as React from "react";
import MuiButton, { ButtonProps } from "@mui/material/Button";

interface IAppButtonProps extends ButtonProps {
  label: string;
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning";
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  width?: number | string;
  fontColor?: string;
}

const AppButton: React.FC<IAppButtonProps> = ({
  label,
  color = "primary",
  variant = "contained",
  onClick,
  width = "auto", 
  fontColor = "#ffffff",
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      variant={variant}
      color={color}
      size="small"
      onClick={onClick}
      sx={{
        textTransform: "none",
        borderRadius: 1,
        px: 2,
        py: 0.5,
        fontWeight: 500,
        fontSize: "0.875rem",
        width,
        textAlign: "center",
        boxShadow: "none",
        color: fontColor,
        ...props.sx,
      }}
    >
      {label}
    </MuiButton>
  );
};

export default AppButton;
