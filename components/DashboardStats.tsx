"use client";

import { Box, BoxProps } from "@mui/material";
import { FC } from "react";
import StatCard, { StatCardProps } from "./StatCard";

interface DashboardStatsProps {
  stats: StatCardProps[];
  containerProps?: BoxProps;
}

const DashboardStats: FC<DashboardStatsProps> = ({ stats, containerProps }) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" {...containerProps}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </Box>
  );
};

export default DashboardStats;
