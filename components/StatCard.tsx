"use client";

import { Box, Card, Typography } from "@mui/material";
import { FC } from "react";
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

const icons = {
  WorkOutlineIcon: <WorkOutlineIcon />,
  GroupWorkIcon: <GroupWorkIcon />,
  AssignmentTurnedInIcon: <AssignmentTurnedInIcon />,
  QueryStatsIcon: <QueryStatsIcon />,
  PeopleAltIcon: <PeopleAltIcon />,
  CurrencyExchangeIcon: <CurrencyExchangeIcon />,
  BallotIcon: <BallotIcon />,
  MarkEmailUnreadIcon: <MarkEmailUnreadIcon />,
  EventAvailableIcon: <EventAvailableIcon />,
  UpdateIcon: <UpdateIcon />,
  HighlightOffIcon: <HighlightOffIcon />,
};

export interface StatCardProps {
  title: string;
  subtitle?: string | number;
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
        height: 110,
        background: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        px: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>

          {description && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                opacity: 0.85,
                mt: 0.25,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          {icons[icon]}
        </Box>
      </Box>
    </Card>
  );
};

export default StatCard;
