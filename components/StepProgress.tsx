"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

interface StepItem {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface StepProgressProps {
  steps: StepItem[];
  activeStep: number;
}

export default function StepProgress({ steps, activeStep }: StepProgressProps) {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        p: 2,
        boxShadow: 1,
        border: "1px solid #E5E7EB",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {steps.map((s, idx) => {
          const isActive = s.number === activeStep;
          const isCompleted = s.number < activeStep;
          const isUpcoming = s.number > activeStep;

          const previousColor = "#3088B7";
          const activeColor = "#005C8A";
          const grey = "#666666";
          const borderGrey = "#666666";

          const circleBg = isActive
            ? activeColor
            : isCompleted
            ? previousColor
            : "#FFFFFF";

          const circleBorder = isUpcoming ? `2px solid ${borderGrey}` : "none";

          const textColor = isActive
            ? activeColor
            : isCompleted
            ? previousColor
            : grey;

          const iconColor = textColor;

          return (
            <React.Fragment key={s.number}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: circleBg,
                    border: circleBorder,
                    color: isUpcoming ? grey : "#fff",
                    fontWeight: 700,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 20,
                  }}
                >
                  {s.number}
                </Box>

                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    color: iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.icon}
                </Box>

                <Box
                  sx={{
                    width: "1px",
                    height: "40px",
                    backgroundColor: borderGrey,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: textColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: grey,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.description}
                  </Typography>
                </Box>
              </Box>

              {idx !== steps.length - 1 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      borderBottom: "2px dashed #dcdcdc",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 18,
                      color: "#dcdcdc",
                      mt: "-2px",
                    }}
                  >
                    →
                  </Typography>
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
