"use client";

import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect } from "react";

const announcements = [
  "System maintenance scheduled for this weekend. Expect brief downtime.",
  "Check out our new blog post on maximizing your freelance opportunities!",
  "New feature rollout: Enhanced invoice tracking module launching next week!",
  "Reminder: Update your profile to get more relevant project matches.",
];

export default function Announcement() {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#F3F6FA",
        borderBottom: "1px solid #E0E0E0",
        borderRadius: 2,
        px: 2,
        py: 1,
        mb: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: "130px",
        }}
      >
        Announcement
        <IconButton
          size="small"
          onClick={handlePrev}
          sx={{ p: 0.5, color: "text.secondary" }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Typography>

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          color: "text.secondary",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          px: 1,
        }}
      >
        {announcements[index]}
      </Typography>

      <IconButton
        size="small"
        onClick={handleNext}
        sx={{ color: "text.secondary" }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
