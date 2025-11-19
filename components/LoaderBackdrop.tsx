"use client";

import { Backdrop, CircularProgress } from "@mui/material";

export default function LoaderBackdrop({ open }: { open: boolean }) {
  return (
    <Backdrop
      open={open}
      sx={{ color: "#fff", zIndex: (t) => t.zIndex.tooltip + 1 }}
    >
      <CircularProgress thickness={4} />
    </Backdrop>
  );
}
