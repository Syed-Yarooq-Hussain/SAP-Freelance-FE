"use client";

import { Chip } from "@mui/material";
import React from "react";
import { colors } from "@/utils/styles/colors";
import { DIMENSIONS } from "@/constants/dimensions";

interface StatusChipProps {
  label: string;
  color: keyof typeof colors;
}

export default function StatusChip({ label, color }: StatusChipProps) {
  const borderColor = colors[color] || colors.GREY;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        borderLeft: `4px solid ${borderColor}`,
        borderRight: `4px solid ${borderColor}`,
        paddingX: 1,
        backgroundColor: "#f9f9f9",
        color: "#000",
        fontWeight: 500,
        fontSize: "0.75rem",
        borderRadius: 1,
        width: DIMENSIONS.CHIP_WIDTH,
        textAlign: "center",
      }}
    />
  );
}
