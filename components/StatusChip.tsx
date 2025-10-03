"use client";

import { Chip } from "@mui/material";
import React from "react";

export type StatusType =
  | "Under review"
  | "Confirmed"
  | "In progress"
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Request"
  | "Reschedule"
  | "Rejected"
  | "Todo"
  | "Delayed"
  | "Signed";

interface StatusChipProps {
  label: StatusType;
  color: string;
}

const chipWidth = 100;

export default function StatusChip({ label, color }: StatusChipProps) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        borderLeft: `4px solid ${color}`,
        borderRight: `4px solid ${color}`,
        paddingX: 1,
        backgroundColor: "#f5f5f5",
        color: "#000",
        fontWeight: 500,
        fontSize: "0.75rem",
        borderRadius: 1,
        width: chipWidth,
        textAlign: "center",
      }}
    />
  );
}
