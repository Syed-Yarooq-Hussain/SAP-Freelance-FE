"use client";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BallotIcon from "@mui/icons-material/Ballot";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import UpdateIcon from "@mui/icons-material/Update";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";

const icons = {
  WorkOutlineIcon: <WorkOutlineIcon fontSize="large" />,
  GroupWorkIcon: <GroupWorkIcon fontSize="large" />,
  AssignmentTurnedInIcon: <AssignmentTurnedInIcon fontSize="large" />,
  QueryStatsIcon: <QueryStatsIcon fontSize="large" />,
  PeopleAltIcon: <PeopleAltIcon fontSize="large" />,
  CurrencyExchangeIcon: <CurrencyExchangeIcon fontSize="large" />,
  BallotIcon: <BallotIcon fontSize="large" />,
  MarkEmailUnreadIcon: <MarkEmailUnreadIcon fontSize="large" />,
  EventAvailableIcon: <EventAvailableIcon fontSize="large" />,
  UpdateIcon: <UpdateIcon fontSize="large" />,
  HighlightOffIcon: <HighlightOffIcon fontSize="large" />,
};

export interface StatCardProps {
  title: string;
  subtitle: string | number;
  description?: string;
  color: string;
  icon: keyof typeof icons;
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
        width: "100%",
        height: "100%",
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
          <Box>{icons[icon]}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
