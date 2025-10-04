"use client";

import QueryProvider from "@/providers/QueryProvider";
import getTheme from "@/theme";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import { useMemo, useState } from "react";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode] = useState<"light" | "dark">("light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <html lang="en" className={`${poppins.variable} ${poppins.variable}`}>
      <body>
        <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryProvider>
              <SessionProvider>
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
                    {children}
                  </Box>
                </Container>
              </SessionProvider>
            </QueryProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
