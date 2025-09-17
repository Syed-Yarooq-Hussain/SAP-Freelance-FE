"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const AppTitle: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Image
        src="/vx9-logo-02.png"
        alt="Vertex9 Systems Logo"
        width={100}
        height={50}
        style={{ marginRight: "8px" }}
        priority
      />
      <Typography variant="h6" noWrap component="div">
        SAP Portal
      </Typography>
    </Box>
  );
};

export default AppTitle;
