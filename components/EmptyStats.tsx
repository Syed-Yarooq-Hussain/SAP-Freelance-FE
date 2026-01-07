"use client";

import { Box, Typography } from "@mui/material";

interface Props {
  text: string;
}

const EmptyState = ({ text }: Props) => {
  return (
    <Box py={2}>
      <Typography variant="body2" color="text.secondary" align="center">
        {text}
      </Typography>
    </Box>
  );
};

export default EmptyState;
