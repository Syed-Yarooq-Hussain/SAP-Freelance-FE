"use client";

import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";
import { useMemo } from "react";

import GlobalLoader from "@/components/GlobalLoader";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import getTheme from "@/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useMemo(() => getTheme("light"), []);

  return (
    <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SessionProvider refetchInterval={0} refetchWhenOffline={false}>
              <Container
                maxWidth={false}
                disableGutters
                sx={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  pb: 4,
                }}
              >
                <Box component="main" sx={{ p: 1 }}>
                  <ToastProvider>
                    <GlobalLoader />
                    {children}
                  </ToastProvider>
                </Box>
              </Container>
            </SessionProvider>
          </LocalizationProvider>
        </QueryProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
