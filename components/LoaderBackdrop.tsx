"use client";

import colors from "@/utils/styles/colors";
import { Backdrop, CircularProgress } from "@mui/material";

type LoaderBackdropProps = {
  open: boolean;
  color?: string;
};

export default function LoaderBackdrop({
  open,
  color = colors.BLUE,
}: LoaderBackdropProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backdropFilter: "blur(3px)",
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
    >
      <CircularProgress
        thickness={4}
        sx={{
          color,
        }}
      />
    </Backdrop>
  );
}
