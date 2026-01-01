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
import { Box, Card, Skeleton, Typography } from "@mui/material";
import { FC } from "react";

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
  loading?: boolean;
}

const StatCard: FC<StatCardProps> = ({
  title,
  subtitle,
  description,
  color,
  icon,
  loading = false,
}) => {
  return (
    <Card
      sx={{
        height: 90,
        background: "linear-gradient(#23618C, #4094CF, #3BB2F5)",
        color: "#fff",
        borderRadius: "15px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.5s ease",
        display: "flex",
        alignItems: "center",
        px: 2.5,
        border: "2px solid transparent",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-30%",
          width: "200%",
          height: "200%",
          background:
          "linear-gradient(0deg, transparent, transparent 30%, rgba(7, 224, 237,0.6))",
          transform: "rotate(-45deg)",
          transition: "all 0.8s ease",
          opacity: 0,
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "1px 1px 5px rgba(0, 212, 212)",
          borderColor: "rgba(7, 10, 140)",
        },
        "&:hover::before": {
          opacity: 1,
          transform: "rotate(-45deg) translateY(100%)",
        },
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
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 1000,
              fontFamily: "serif",
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
            width: 35,
            height: 35,
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
