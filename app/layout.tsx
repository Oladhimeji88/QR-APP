import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "QR code generator",
    "Next.js QR app",
    "local QR code creator",
    "PNG SVG QR download",
  ],
  icons: {
    icon: "/pubbleradar.png",
    shortcut: "/pubbleradar.png",
    apple: "/pubbleradar.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} min-h-screen bg-[color:var(--background)] font-sans text-[color:var(--foreground)] antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,212,113,0.16),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(156,198,177,0.14),transparent_26%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(99,212,113,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,212,113,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_92%)]" />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
