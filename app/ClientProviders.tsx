"use client";

import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";
import { useMemo } from "react";

import GlobalLoader from "@/components/GlobalLoader";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import getTheme from "@/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Providers } from "@/lib/store/provider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/lib/store/store";
import { Toaster } from "@/components/homepage/ui/sonner";
import ThemeRegistry from "./ThemeRegistry";
import { usePathname } from "next/navigation";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const theme = useMemo(() => getTheme("light"), []);

  return (
    <ThemeRegistry>
      {/* <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}> */}
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
                  flexDirection: "column"
                }}
              >
                <Box component="main">
                  <ToastProvider>
                    <GlobalLoader />
                    <Providers>
                      <PersistGate persistor={persistor} loading={null}>
                        {children}
                      </PersistGate>
                    </Providers>
                  </ToastProvider>
                  <Toaster />
                </Box>
              </Container>
            </SessionProvider>
          </LocalizationProvider>
          </QueryProvider>
        </ThemeProvider>
      {/* </AppRouterCacheProvider> */}
    </ThemeRegistry>
  );
}
