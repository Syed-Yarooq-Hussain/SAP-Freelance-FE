"use client";

import { useUpdateConsultantStatus } from "@/actions/admin/useUpdateConsultantStatus";
import { colors } from "@/utils/styles/colors";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, IconButton, Tooltip } from "@mui/material";

interface Props {
  consultantId: number;
}

export default function AdminConsultantActionCell({ consultantId }: Props) {
  const { mutate, isPending } = useUpdateConsultantStatus();

  return (
    <Box display="flex" gap={1.5}>
      <Tooltip title="Accept">
        <IconButton
          size="small"
          disabled={isPending}
          sx={{ color: colors.GREEN }}
          onClick={() => mutate({ consultantId, status: "active" })}
        >
          <CheckCircleIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Reject">
        <IconButton
          size="small"
          disabled={isPending}
          sx={{ color: colors.RED }}
          onClick={() => mutate({ consultantId, status: "rejected" })}
        >
          <CancelIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
