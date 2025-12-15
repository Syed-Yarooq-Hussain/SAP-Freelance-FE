"use client";

import { createTheme } from "@mui/material/styles";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3088B7",
      },
      secondary: {
        main: "#73b4ff",
      },
      background: {
        default: mode === "light" ? "#F6F7FB" : "#1a1a1a",
        paper: mode === "light" ? "#ffffff" : "#222222",
      },
      text: {
        primary: mode === "light" ? "#000000ff" : "#ffffff",
        secondary: mode === "light" ? "#555" : "#ccc",
      },
    },

    typography: {
      fontFamily:
        "var(--font-open-sans), 'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif",
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "#3088B7",
            color: "#000000ff",
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

      MuiPopover: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
      MuiModal: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          disablePortal: true,
        },
      },
      MuiSelect: {
        defaultProps: {
          MenuProps: {
            disableScrollLock: true,
          },
        },
      },
    },
  });

export default getTheme;
