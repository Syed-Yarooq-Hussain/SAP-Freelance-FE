"use client";

import { Alert, AlertColor, Snackbar } from "@mui/material";
import * as React from "react";

type ToastCtx = {
  toast: (message: string, severity?: AlertColor) => void;
};

const Ctx = React.createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return React.useContext(Ctx);
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");
  const [severity, setSeverity] = React.useState<AlertColor>("info");

  const toast = (message: string, sev: AlertColor = "info") => {
    setMsg(message);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Ctx.Provider>
  );
}
