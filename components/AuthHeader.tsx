"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface IAuthHeaderProps {
  heading: string;
  description: string;
}

const AuthHeader: React.FC<IAuthHeaderProps> = ({ heading, description }) => {
  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Image
          src="/vx9-logo-02.png"
          alt="Vertex9 Systems Logo"
          width={0}
          height={0}
          style={{ width: "100%", height: "auto", maxWidth: "150px" }}
          sizes="(max-width: 600px) 80px,
                 (max-width: 900px) 120px,
                 150px"
          priority
        />
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {heading}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default AuthHeader;
