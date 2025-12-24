"use client";

import colors from "@/utils/styles/colors";
import { Box, LinearProgress, Typography } from "@mui/material";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function FormProgress({
  currentStep,
  totalSteps,
}: FormProgressProps) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          Step {currentStep + 1} of {totalSteps}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {percent}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            backgroundColor: colors.BLUE,
          },
        }}
      />
    </Box>
  );
}
