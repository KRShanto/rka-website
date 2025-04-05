import type React from "react"
import ClientLayout from "./ClientLayout"

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
}

export const metadata = {
  title: "Bangladesh Wadokai Karate Do",
  description: "Official website of Bangladesh Wadokai Karate Do",
  icons: {
    icon: "/bwkd-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}



import './globals.css'