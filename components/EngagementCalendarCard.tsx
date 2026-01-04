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
        <Typography variant={titleVariant} sx={{ fontWeight: 700 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Dot bg={colors.GREEN} />
            <Typography variant="caption">Availability</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Dot bg={colors.DARK_BLUE} />
            <Typography variant="caption">Events</Typography>
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
