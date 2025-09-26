"use client";

import { Box } from "@mui/material";
import { FC } from "react";
import StatCard, { StatCardProps } from "./StatCard";

interface DashboardStatsProps {
  stats: StatCardProps[];
}

const DashboardStats: FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </Box>
  );
};

export default DashboardStats;
