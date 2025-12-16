"use client";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface AnnouncementProps {
  items: string[];
  autoScrollInterval?: number;
}

export default function Announcement({
  items,
  autoScrollInterval = 8000,
}: AnnouncementProps) {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [items.length, autoScrollInterval]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#E6F1FA",
        px: 2,
        py: 1,
        borderRadius: 2,
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
          <ArrowBackIosNewIcon sx={{ fontSize: 16, color:"red" }} />
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
          fontStyle: "italic",
          fontfamily:"serif",
          textOverflow: "ellipsis",
          px: 1,
        }}
      >
        {items[index]}
      </Typography>

      <IconButton
        size="small"
        onClick={handleNext}
        sx={{ color: "text.secondary" }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16, color:"red" }} />
      </IconButton>
    </Box>
  );
}
