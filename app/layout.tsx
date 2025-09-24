import type React from "react";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next";
import { getUser } from "@/lib/auth";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export const metadata = {
  title: "Roni Karate Academy",
  description: "Official website of Roni Karate Academy",
  icons: {
    icon: "/rka-logo.png",
  },
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}

import "./globals.css";
