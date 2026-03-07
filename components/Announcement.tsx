"use client";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CampaignIcon from "@mui/icons-material/Campaign";
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
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (nextIndex: number) => {
    if (nextIndex === index) return;
    setIsAnimating(true);
    setIndex(nextIndex);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = () => {
    goTo(index === 0 ? items.length - 1 : index - 1);
  };

  const handleNext = () => {
    goTo(index === items.length - 1 ? 0 : index + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [items.length, autoScrollInterval]);

  if (!items.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.5,
        mb: 1.5,
        borderRadius: 2,
        background: "linear-gradient(135deg, #E8F4FC 0%, #F0F7FF 50%, #E3EEF9 100%)",
        border: "1px solid",
        borderColor: "primary.light",
        boxShadow: "0 2px 8px rgba(48, 136, 183, 0.12)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 14px rgba(48, 136, 183, 0.18)",
        },
      }}
    >
      {/* Label with icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          color: "white",
          minWidth: "140px",
          justifyContent: "center",
        }}
      >
        <CampaignIcon sx={{ fontSize: 18, opacity: 0.95 }} />
        <Typography
          variant="subtitle2"
          fontWeight="700"
          sx={{ letterSpacing: "0.02em", textTransform: "uppercase" }}
        >
          Announcement
        </Typography>
      </Box>

      {/* Prev button */}
      <IconButton
        size="small"
        onClick={handlePrev}
        sx={{
          p: 0.75,
          color: "primary.main",
          bgcolor: "rgba(48, 136, 183, 0.08)",
          "&:hover": {
            color: "white",
            bgcolor: "primary.main",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* Content with animation */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 0.5,
        }}
      >
        <Typography
          key={index}
          variant="body2"
          sx={{
            color: "text.primary",
            fontWeight: 500,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            px: 1,
            animation: isAnimating ? "announcementSlide 0.3s ease-out" : "none",
            "@keyframes announcementSlide": {
              "0%": { opacity: 0, transform: "translateY(6px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {items[index]}
        </Typography>
      </Box>

      {/* Next button */}
      <IconButton
        size="small"
        onClick={handleNext}
        sx={{
          p: 0.75,
          color: "primary.main",
          bgcolor: "rgba(48, 136, 183, 0.08)",
          "&:hover": {
            color: "white",
            bgcolor: "primary.main",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* Dot indicators */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          minWidth: "60px",
          justifyContent: "center",
        }}
      >
        {items.map((_, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              width: i === index ? 10 : 6,
              height: 6,
              borderRadius: 3,
              bgcolor: i === index ? "primary.main" : "action.disabled",
              cursor: "pointer",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: i === index ? "primary.dark" : "primary.light",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
