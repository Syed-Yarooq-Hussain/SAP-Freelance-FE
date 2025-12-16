"use client";

import { Box, BoxProps } from "@mui/material";
import { FC } from "react";
import StatCard, { StatCardProps } from "./StatCard";

interface DashboardStatsProps {
  stats: StatCardProps[];
  containerProps?: BoxProps;
}

const StatsCardList: FC<DashboardStatsProps> = ({ stats, containerProps }) => {
  return (
    <Box
      {...containerProps}
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(200px, 1fr))",
        },
        alignItems: "stretch",
        ...(containerProps?.sx || {}),
      }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </Box>
  );
};

export default StatsCardList;
