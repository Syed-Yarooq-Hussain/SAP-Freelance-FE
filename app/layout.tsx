"use client";

import "./globals.css";  

import { Open_Sans } from "next/font/google";
import ClientProviders from "./ClientProviders";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>
        {/* ✅ Client wrapper here */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}