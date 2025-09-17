"use client";

import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#4099ff", // fallback color
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
      fontFamily: "var(--font-roboto)",
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "linear-gradient(to right, #4099ff, #73b4ff)",
          },
        },
      },
    },
  });

export default getTheme;
