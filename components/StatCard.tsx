"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { FC, ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  color: string;
  icon?: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, color, icon }) => {
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 200,
        borderRadius: 2,
        background: color,
        color: "#fff",
        boxShadow: 5,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          {icon && <Box>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
