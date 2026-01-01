"use client";

import MonthlyCalendar, { CalendarEvent } from "@/components/MonthlyCalendar";
import colors from "@/utils/styles/colors";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material/Typography";

const Dot = ({ bg }: { bg: string }) => (
  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: bg }} />
);

interface EngagementCalendarCardProps {
  events: CalendarEvent[];
  year?: number;
  month?: number;
  framed?: boolean;
  title?: string;
  titleVariant?: TypographyProps["variant"];
}

export default function EngagementCalendarCard({
  events,
  year,
  month,
  framed = true,
  title = "Engagement Calendar",
  titleVariant = "h6",
}: EngagementCalendarCardProps) {
  const today = new Date();
  const y = year ?? today.getFullYear();
  const m = month ?? today.getMonth();

  const body = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
           variant={titleVariant}
            sx={{
              fontWeight: 700,
              position: "relative",
              cursor: "pointer",
              transition: "all 0.3s ease",
              color: "#041C7A",
              "&:hover": {
                color: "#2563eb",
                transform: "translateY(-1px)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: -4,
                width: "100%",
                height: "2px",
                background:"linear-gradient(90deg, #2563eb, #22d3ee)",
                transform: "scaleX(0)",
                transformOrigin: "right",
                transition: "transform 0.35s ease",
              },
               "&:hover::after": {transform: "scaleX(1)",transformOrigin: "left",},  
            }}>
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "nowrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center"}}>
            🔥
            <Typography variant="caption">Project Work</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            🤞
            <Typography variant="caption">Interview</Typography>
          </Box>
        </Box>
      </Box>

      <MonthlyCalendar
        year={y}
        month={m}
        mode="compact"
        events={events}
        framed={false}
        showTitle={false}
        showNav={false}
        showLegend={false}
      />
    </>
  );

  if (!framed) return body;

  return <Box>{body}</Box>;
}
