"use client";

import { Avatar, Box, Typography } from "@mui/material";
import colors from "@/utils/styles/colors";
import React from "react";

export default function RoleHierarchy() {
  const roles = [
    { title: "PMO", color: colors.BLUE, top: 30, left: 80 },
    { title: "Solution Architect", color: "#F4B183", top: 110, left: 180 },
    {
      title: "Albert Flores",
      subLabel: "Lead Functional consultant",
      color: "#92D050",
      avatar: "/images/a3.png",
      top: 190,
      left: 280,
    },
    { title: "Technical lead", color: "#FFD4DB", top: 270, left: 380 },
    { title: "Consultant", color: "#D9D9D9", top: 350, left: 480 },
    {
      title: "Lily Wilson",
      subLabel: "Junior Consultant",
      color: "#444",
      avatar: "/images/a4.png",
      top: 430,
      left: 580,
    },
  ];

  const BASELINE = 520;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        mt: 3,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={3}>
        Visual Role Hierarchy
      </Typography>

      <Box sx={{ position: "relative", height: BASELINE }}>
        {roles.map((role, index) => (
          <React.Fragment key={index}>
            <Box
              sx={{
                position: "absolute",
                top: role.top,
                left: role.left,
                width: "2px",
                height: BASELINE - role.top,
                backgroundColor: "#000",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: role.top - 6,
                left: role.left - 5,
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid #000",
                backgroundColor: "#fff",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: role.top + (BASELINE - role.top) / 2 - 4,
                left: role.left - 3,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#000",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: role.top + 10,
                left: role.left + 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.5,
              }}
            >
              {role.avatar ? (
                <>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={role.avatar}
                      sx={{ width: 30, height: 30, border: "1px solid #ddd" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#333",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {role.title}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      backgroundColor:
                        role.color === "#444" ? "#444" : `${role.color}33`,
                      color: role.color === "#444" ? "#fff" : "#333",
                      px: 1.3,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {role.subLabel}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    backgroundColor: role.color,
                    color: "#fff",
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {role.title}
                </Box>
              )}
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
