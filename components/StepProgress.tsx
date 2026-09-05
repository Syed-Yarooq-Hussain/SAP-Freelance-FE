"use client";

import { Box, Typography } from "@mui/material";
import { Check } from "lucide-react";
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
  onStepClick?: (step: number) => void;
  isStepAccessible?: (step: number) => boolean;
}

export default function StepProgress({
  steps,
  activeStep,
  onStepClick,
  isStepAccessible = () => true,
}: StepProgressProps) {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "20px",
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
        p: { xs: 1.5, md: 2 },
        scrollbarWidth: "thin",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "stretch", minWidth: { xs: 760, lg: "100%" } }}>
        {steps.map((step, index) => {
          const isActive = step.number === activeStep;
          const isCompleted = step.number < activeStep;
          const isAccessible = isStepAccessible(step.number);

          return (
            <React.Fragment key={step.number}>
              <Box
                role={onStepClick ? "button" : undefined}
                tabIndex={onStepClick ? 0 : undefined}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={!isAccessible}
                onClick={() => onStepClick?.(step.number)}
                onKeyDown={(event) => {
                  if (!onStepClick || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  onStepClick(step.number);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 155,
                  gap: 1.25,
                  px: { xs: 1, md: 1.5 },
                  py: 1,
                  borderRadius: "14px",
                  bgcolor: isActive ? "#EFF8FF" : "transparent",
                  cursor: onStepClick
                    ? isAccessible
                      ? "pointer"
                      : "not-allowed"
                    : "default",
                  opacity: isAccessible ? 1 : 0.55,
                  transition: "background-color 0.2s ease, opacity 0.2s ease",
                  "&:hover": onStepClick && isAccessible
                    ? { bgcolor: isActive ? "#EFF8FF" : "#F8FAFC" }
                    : undefined,
                  "&:focus-visible": onStepClick
                    ? { outline: "2px solid #005C8A", outlineOffset: 2 }
                    : undefined,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "12px",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: isActive || isCompleted ? "#005C8A" : "#F8FAFC",
                    border: isActive || isCompleted ? "none" : "1px solid #CBD5E1",
                    color: isActive || isCompleted ? "#fff" : "#64748B",
                    fontWeight: 800,
                  }}
                >
                  {isCompleted ? <Check size={19} strokeWidth={3} /> : step.number}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 750, color: isActive ? "#005C8A" : isCompleted ? "#334155" : "#64748B", whiteSpace: "nowrap" }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 11.5, color: "#94A3B8", whiteSpace: "nowrap" }}>
                    {step.description}
                  </Typography>
                </Box>
              </Box>

              {index < steps.length - 1 && (
                <Box sx={{ width: { xs: 28, lg: 45 }, display: "flex", alignItems: "center", px: 0.5, flexShrink: 0 }}>
                  <Box sx={{ width: "100%", height: 2, borderRadius: 2, bgcolor: step.number < activeStep ? "#005C8A" : "#E2E8F0" }} />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
