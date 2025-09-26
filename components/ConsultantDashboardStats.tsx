"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { FC } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import BallotIcon from "@mui/icons-material/Ballot";

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  icon?: React.ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, color, icon }) => {
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 200,
        borderRadius: 2,
        backgroundColor: color,
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

const DashboardStats: FC = () => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <StatCard
        title="Appeared in search"
        value={360}
        color="#4680FF"
        icon={<QueryStatsIcon fontSize="large" />}
      />
      <StatCard
        title="Scheduled Interview"
        value={10}
        color="#00997B"
        icon={<PeopleAltIcon fontSize="large" />}
      />
      <StatCard
        title="Hourly rates"
        value="$30 / hr"
        color="#FFB64E"
        icon={<CurrencyExchangeIcon fontSize="large" />}
      />
      <StatCard
        title="Skills"
        value="4hana"
        color="#FF5471"
        icon={<BallotIcon fontSize="large" />}
      />
    </Box>
  );
};

export default DashboardStats;
