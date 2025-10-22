"use client";

import colors from "@/utils/styles/colors";
import { Box, Typography } from "@mui/material";

interface StepItem {
  number: number;
  title: string;
  description: string;
}

interface StepProgressProps {
  steps: StepItem[];
  activeStep: number;
  activeColor?: string;
}

export default function StepProgress({
  steps,
  activeStep,
  activeColor = colors.RED,
}: StepProgressProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        width: "100%",
        whiteSpace: "nowrap",
        gap: 2,
        py: 1,
      }}
    >
      {steps.map((step) => {
        const isActive = step.number === activeStep;

        return (
          <Box
            key={step.number}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: isActive ? activeColor : "#B4B4B4",
              borderRadius: "15px 0 0 15px",
              overflow: "hidden",
              minWidth: 235,
              height: 70,
              bgcolor: "#fff",
              mr: 1,
              boxShadow: isActive
                ? `0 2px 6px ${activeColor}40`
                : "0 1px 3px rgba(0,0,0,0.05)",
              transition: "all 0.25s ease",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: "100%",
                backgroundColor: isActive ? activeColor : "#B4B4B4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              {step.number}
            </Box>

            <Box
              sx={{
                flex: 1,
                px: 1.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: isActive ? activeColor : "#555",
                  fontSize: 14,
                }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isActive ? "#111" : "#9ca3af",
                  fontSize: 12.5,
                  mt: 0.2,
                }}
              >
                {step.description}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
