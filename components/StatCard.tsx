"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { FC, ReactNode } from "react";

export interface StatCardProps {
  title: string;
  subtitle: string | number;
  description?: string;
  color: string;
  icon?: ReactNode;
}

const StatCard: FC<StatCardProps> = ({
  title,
  subtitle,
  description,
  color,
  icon,
}) => {
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
            {title && (
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="h6" fontWeight="bold">
                {subtitle}
              </Typography>
            )}
            {description && (
              <Typography variant="body2">{description}</Typography>
            )}
          </Box>
          {icon && <Box>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
