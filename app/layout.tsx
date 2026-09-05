import "react-quill-new/dist/quill.snow.css";
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

const manrope = localFont({
  src: "../public/fonts/manrope.ttf",
  variable: "--font-manrope", // optional
  weight: "500",
});

const syne = localFont({
  src: "../public/fonts/syne.otf",
  variable: "--font-syne", // optional
  weight: "500",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${neueHass.variable} ${manrope.variable} ${syne.variable}`}>
      <body>
        {/* ✅ Client wrapper here */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
