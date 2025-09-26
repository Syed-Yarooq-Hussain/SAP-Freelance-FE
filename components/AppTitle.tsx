"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

const AppTitle: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="h6" noWrap component="div">
        Dashboard
      </Typography>
    </Box>
  );
};

export default AppTitle;
