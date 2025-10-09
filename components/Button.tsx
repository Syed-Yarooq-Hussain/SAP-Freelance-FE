"use client";

import { BUTTON_WIDTH } from "@/constants/dimensions";
import { colors } from "@/utils/styles/colors";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import * as React from "react";

interface IAppButtonProps extends ButtonProps {
  label: string;
  colorKey?: keyof typeof colors;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  width?: number | string;
  fontColor?: string;
}

const AppButton: React.FC<IAppButtonProps> = ({
  label,
  colorKey = "BLUE",
  variant = "contained",
  onClick,
  width = BUTTON_WIDTH,
  fontColor,
  ...props
}) => {
  const mainColor = colors[colorKey];
  const textColor = variant === "outlined" ? mainColor : fontColor || "#ffffff";
  const bgColor = variant === "outlined" ? "transparent" : mainColor;
  
  return (
    <MuiButton
      {...props}
      variant={variant}
      onClick={onClick}
      size="small"
      sx={{
        textTransform: "none",
        borderRadius: 1,
        px: 2,
        py: 0.6,
        fontWeight: 500,
        fontSize: "0.875rem",
        width,
        textAlign: "center",
        boxShadow: "none",
        backgroundColor: bgColor,
        color: textColor,
        "&:hover": {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
        ...props.sx,
      }}
    >
      {label}
    </MuiButton>
  );
};

export default AppButton;
