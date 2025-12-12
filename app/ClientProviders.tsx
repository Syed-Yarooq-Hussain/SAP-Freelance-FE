"use client";

import { useMemo } from "react";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";

import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import GlobalLoader from "@/components/GlobalLoader";
import getTheme from "@/theme";

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
        </QueryProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
