"use client";

import { DIMENSIONS } from "@/constants/dimensions";
import { STATUS } from "@/constants/status_dropdown";
import { colors, statusColors } from "@/utils/styles/colors";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useClientMeetingStatus } from "@/actions/common/useClientMeetings";

interface StatusDropdownProps {
  value: STATUS | string;
  onChange?: (value: STATUS | string) => void;
  onRescheduleClick?: () => void;
  onRejectClick?: () => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  onRescheduleClick,
  onRejectClick,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<STATUS | string>(value);
  const [statusList, setStatusList] = useState<string[]>([]);
  const { mutate: loadStatus } = useClientMeetingStatus();

  useEffect(() => {
    loadStatus(undefined, {
      onSuccess: (res) => {
        setStatusList(res.data ?? []);
      },
      onError: () => {
        setStatusList(Object.values(STATUS));
      },
    });
  }, [loadStatus]);

  useEffect(() => {
    setSelectedStatus(value);
  }, [value]);

  const handleChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as STATUS | string;
    
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

  return (
    <Box
      sx={{
        width: DIMENSIONS.CHIP_WIDTH,
        height: 25,
        borderRadius: 1,
        backgroundColor: "#fff",
        borderLeft: `4px solid ${colors[colorKey]}`,
        borderRight: `4px solid ${colors[colorKey]}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: 500,
        fontSize: "0.8rem",
      }}
    >
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
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
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
        {statusList.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default StatusDropdown;
