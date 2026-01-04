"use client";

import { WEEKDAYS } from "@/constants/calendar";
import { Box, Skeleton } from "@mui/material";

export default function SkeletonCalendar() {
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          mb: 1,
        }}
      >
        {WEEKDAYS.map((w) => (
          <Skeleton
            key={w}
            variant="rounded"
            height={32}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
        }}
      >
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={90}
            sx={{ borderRadius: 1.5 }}
          />
        ))}
      </Box>
    </Box>
  );
}
