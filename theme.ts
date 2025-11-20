"use client";

import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#4099ff",
      },
      secondary: {
        main: "#73b4ff",
      },
      background: {
        default: mode === "light" ? "#f4f6f8" : "#1a1a1a",
        paper: mode === "light" ? "#ffffff" : "#222222",
      },
      text: {
        primary: mode === "light" ? "#000000ff" : "#ffffff",
        secondary: mode === "light" ? "#555" : "#ccc",
      },
    },
    typography: {
      fontFamily: "var(--font-open-sans), 'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "#4680FF",
            color: "#fff",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 50,
            "@media (min-width:600px)": {
              minHeight: 50,
            },
          },
        },
      },
    },
  });

export default getTheme;
