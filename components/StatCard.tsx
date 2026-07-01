"use client";

import colors from "@/utils/styles/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BallotIcon from "@mui/icons-material/Ballot";
import CreditCardIcon from "@mui/icons-material/CreditCard";
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
  AccessTimeIcon: <AccessTimeIcon />,
  CreditCardIcon: <CreditCardIcon />,
};

export type StatCardVariant = "filled" | "outlined" | "accent";

export interface StatCardProps {
  title: string;
  subtitle?: string | number;
  description?: string;
  extra?: string;
  color: string;
  icon: keyof typeof icons;
  loading?: boolean;
  variant?: StatCardVariant;
}

const StatCard: FC<StatCardProps> = ({
  title,
  subtitle,
  description,
  extra,
  color,
  icon,
  loading = false,
  variant = "filled",
}) => {
  const isOutlined = variant === "outlined";
  const isModern = isOutlined || variant === "accent";

  return (
    <Card
      sx={{
        minHeight: 110,
        height: "auto",
        background: isOutlined ? colors.LIGHT_YELLOW : color,
        color: isOutlined ? "#1C1C1C" : "#fff",
        border: isOutlined ? "1px solid #E8EAED" : "none",
        borderRadius: isModern ? 2.5 : undefined,
        boxShadow: isModern ? "none" : undefined,
        display: "flex",
        alignItems: "center",
        px: 2.5,
        py: 2,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: isModern ? 72 : undefined,
            flex: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: isOutlined ? 1 : 0.9,
              fontWeight: 500,
              color: isOutlined ? "#4A4A4A" : "inherit",
            }}
          >
            {title}
          </Typography>

          {extra && (
            <Typography
              variant="caption"
              sx={{
                opacity: 0.85,
                fontWeight: 600,
                display: "block",
                mt: 0.25,
              }}
            >
              {extra}
            </Typography>
          )}

          {loading ? (
            <Skeleton
              variant="text"
              width={80}
              height={36}
              sx={{
                bgcolor: isOutlined
                  ? "rgba(0,0,0,0.08)"
                  : "rgba(255,255,255,0.35)",
                mt: isModern ? "auto" : 0.5,
              }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.2,
                mt: isModern ? "auto" : 0.5,
                pt: isModern ? 1 : 0,
              }}
            >
              {subtitle}
            </Typography>
          )}

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
            borderRadius: isModern ? 1.5 : "50%",
            background: isOutlined
              ? color
              : "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            flexShrink: 0,
            ml: 2,
            lineHeight: 0,
            color: "#fff",
            "& svg": {
              fontSize: 22,
              display: "block",
            },
          }}
        >
          {icons[icon]}
        </Box>
      </Box>
    </Card>
  );
};

export default StatCard;
