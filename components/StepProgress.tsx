"use client";

import {
  STEP_PROGRESS,
  STEP_PROGRESS_TOTAL_WIDTH,
} from "@/constants/dimensions";
import colors from "@/utils/styles/colors";
import { Box, Typography } from "@mui/material";
import * as React from "react";

interface StepItem {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
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
  const H = STEP_PROGRESS.CARD_HEIGHT;
  const R = STEP_PROGRESS.CARD_RADIUS;
  const BW = STEP_PROGRESS.BORDER_WIDTH;
  const ARW = STEP_PROGRESS.ARROW_WIDTH;
  const W = STEP_PROGRESS_TOTAL_WIDTH;
  const CONNECTOR = STEP_PROGRESS.CONNECTOR_WIDTH;
  const BADGE = STEP_PROGRESS.BADGE_DIAMETER;
  const COMPLETED_COLOR = colors.BLUE;
  const UPCOMING_GRAY = "#D1D5DB";
  const TEXT_GRAY = "#666666";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 2,
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        px: 2,
        py: 2,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{ width: "100%", overflowX: "auto", columnGap: 0 }}
      >
        {steps.map((s, idx) => {
          const isActive = s.number === activeStep;
          const isCompleted = s.number < activeStep;

          const stroke = isActive
            ? activeColor
            : isCompleted
            ? COMPLETED_COLOR
            : UPCOMING_GRAY;

          const titleColor = isActive
            ? activeColor
            : isCompleted
            ? COMPLETED_COLOR
            : TEXT_GRAY;

          const subColor = isActive
            ? TEXT_GRAY
            : isCompleted
            ? "#6B7280"
            : "#9CA3AF";

          const path = [
            `M ${R},${BW / 2}`,
            `L ${W - ARW},${BW / 2}`,
            `L ${W - BW / 2},${H / 2}`,
            `L ${W - ARW},${H - BW / 2}`,
            `L ${R},${H - BW / 2}`,
            `A ${R},${R} 0 0 1 ${BW / 2},${H - R}`,
            `L ${BW / 2},${R}`,
            `A ${R},${R} 0 0 1 ${R},${BW / 2}`,
            "Z",
          ].join(" ");

          return (
            <React.Fragment key={s.number}>
              <Box sx={{ position: "relative", height: H, minWidth: W }}>
                <svg
                  width={W}
                  height={H}
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  style={{ position: "absolute", inset: 0, display: "block" }}
                >
                  <path
                    d={path}
                    fill="#fff"
                    stroke={stroke}
                    strokeWidth={BW}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 2,
                    pr: 6,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      border: `2px solid ${stroke}`,
                      color: titleColor,
                      backgroundColor: "#fff",
                      flex: "0 0 28px",
                    }}
                  >
                    {s.icon ?? "⋯"}
                  </Box>

                  <Box
                    sx={{
                      width: 1,
                      height: 26,
                      bgcolor: stroke,
                      opacity: 0.5,
                      mx: 1,
                      flex: "0 0 1px",
                      borderRadius: 1,
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: titleColor,
                        fontSize: 14,
                        lineHeight: 1.2,
                      }}
                    >
                      {s.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: subColor,
                        fontSize: 12.5,
                        overflow: "hidden",
                      }}
                    >
                      {s.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                aria-hidden
                sx={{
                  position: "relative",
                  width: idx === steps.length - 1 ? BADGE : CONNECTOR,
                  height: H,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {idx !== steps.length - 1 && (
                  <svg
                    width="100%"
                    height="2"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                    viewBox={`0 0 ${CONNECTOR} 2`}
                    preserveAspectRatio="none"
                  >
                    <line
                      x1={BADGE / 2 + 6}
                      y1="1"
                      x2={CONNECTOR}
                      y2="1"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                      strokeDasharray="8"
                    />
                  </svg>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: BADGE,
                    height: BADGE,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor: isActive
                      ? activeColor
                      : isCompleted
                      ? COMPLETED_COLOR
                      : "#666666",
                    boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                  }}
                >
                  {s.number}
                </Box>
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
