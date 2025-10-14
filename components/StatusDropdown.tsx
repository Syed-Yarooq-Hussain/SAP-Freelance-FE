"use client";

import { DIMENSIONS } from "@/constants/dimensions";
import { STATUS } from "@/constants/status_dropdown";
import { colors, statusColors } from "@/utils/styles/colors";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

interface StatusDropdownProps {
  value: STATUS;
  onChange?: (value: STATUS) => void;
  onRescheduleClick?: () => void;
  onRejectClick?: () => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  onRescheduleClick,
  onRejectClick,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<STATUS>(value);

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as STATUS;

    if (
      newStatus === STATUS.RESCHEDULE &&
      selectedStatus !== STATUS.RESCHEDULE
    ) {
      onRescheduleClick?.();
    }
    if (newStatus === STATUS.REJECTED && selectedStatus !== STATUS.REJECTED) {
      onRejectClick?.();
    }

    setSelectedStatus(newStatus);
    onChange?.(newStatus);
  };

  const colorKey =
    statusColors[selectedStatus as keyof typeof statusColors] || "GREY";
  const borderColor = colors[colorKey];
  const isStatic = selectedStatus === STATUS.PAID;

  return (
    <Box
      sx={{
        width: DIMENSIONS.CHIP_WIDTH,
        height: 25,
        borderRadius: 1,
        backgroundColor: "#fff",
        borderLeft: `4px solid ${borderColor}`,
        borderRight: `4px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: 500,
        fontSize: "0.8rem",
      }}
    >
      {isStatic ? (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
          }}
        >
          {selectedStatus}
        </Box>
      ) : (
        <Select
          value={selectedStatus}
          onChange={handleChange}
          variant="standard"
          disableUnderline
          size="small"
          sx={{
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              textAlign: "center",
              height: "100%",
            },
            "& .MuiSvgIcon-root": {
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#000",
            },
          }}
        >
          {Object.values(STATUS).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );
};

export default StatusDropdown;
