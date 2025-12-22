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
    display: "flex", alignItems: "center",
    px: 2.5, py: 1.2, mb: 1.5,
    borderRadius: "14px", position: "relative",
    background:"linear-gradient(135deg, #e6f1fa, #f8fbff)",
    overflow: "hidden", backdropFilter: "blur(6px)",
    transition: "all 0.35s ease",
    "&:hover": {boxShadow: "0 12px 30px rgba(59,130,246,0.15)", transform: "translateY(-2px)",},
    "&::after": {
      content: '""', position: "absolute",
      bottom: 0, left: 0,
      height: "3px", width: "100%",
      background:"linear-gradient(90deg, #3b82f6, #22d3ee, #3b82f6)",
      backgroundSize: "200% 100%",
      animation: "gradientMove 4s linear infinite",
    },
  }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: "140px",
          position: "relative",
          color: "#1e293b",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": { color: "#2563eb", transform: "translateY(-1px)",},
          "&::after": {
            content: '""',position: "absolute", bottom: -4,
            left: 0, width: "100%", height: "2px",
            background:"linear-gradient(90deg, #2563eb, #22d3ee)",
            transform: "scaleX(0)",transformOrigin: "right",
            transition: "transform 0.35s ease",
          },
          "&:hover::after": {transform: "scaleX(1)",transformOrigin: "left",},
        }}>
        Announcement

        <IconButton
          size="small"
          onClick={handlePrev}
          sx={{p: 0.6,
          transition: "all 0.25s ease",
          "&:hover": {transform: "translateX(-4px) scale(1.1)",color: "#ef4444",},
        }}>
        <ArrowBackIosNewIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Typography>

      <Typography
        key={index}
        variant="body2"
        sx={{
          flex: 1,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          px: 2,
          fontStyle: "italic",
          fontFamily: "serif",
          color: "#334155",
          animation: "textSlideBlur 0.55s ease",
        }}>
        {items[index]}
      </Typography>

      <IconButton
        size="small"
        onClick={handleNext}
        sx={{
          p: 0.6,
          transition: "all 0.25s ease",
          "&:hover": {transform: "translateX(4px) scale(1.1)",color: "#ef4444",},
    }}>
      <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
      </IconButton>

  <style>
    {`
      @keyframes textSlideBlur {
        from {
          opacity: 0;
          transform: translateY(8px);
          filter: blur(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }

      @keyframes gradientMove {
        from { background-position: 0% 50%; }
        to { background-position: 200% 50%; }
      }
    `}
  </style>
    </Box>
  );
}
