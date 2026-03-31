"use client";

import "./globals.css";

import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import ClientProviders from "./ClientProviders";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const neueHass = localFont({
  src: "../public/fonts/neue-hass.otf",
  variable: "--font-neue-hass", // optional
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${neueHass.variable}`}>
      <body>
        {/* ✅ Client wrapper here */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
