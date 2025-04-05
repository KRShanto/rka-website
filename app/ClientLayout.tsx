"use client";

import type React from "react";
import { useState, useEffect, lazy } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  Facebook,
  Youtube,
  Home,
  Info,
  MapPinned,
  Users,
  Bell,
  LogIn,
  Award,
} from "lucide-react";
import { usePathname } from "next/navigation";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
import ResponsiveFooter from "@/components/ResponsiveFooter";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AuthProvider } from "@/providers/AuthProvider";

// Optimize by deferring non-critical components
const FooterNewsletter = lazy(() => import("@/components/FooterNewsletter"));

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Define navigation items
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/branches", label: "Branches", icon: MapPinned },
  { href: "/trainers", label: "Trainers", icon: Users },
  { href: "/black-belts", label: "Black Belts", icon: Award },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/notice", label: "Notice", icon: Bell },
  { href: "/gallery", label: "Gallery", icon: Bell },
  { href: "/login", label: "Login", icon: LogIn },
];

// Define footer columns
const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Branches", href: "/branches" },
      { label: "Trainers", href: "/trainers" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Achievements", href: "/achievements" },
      { label: "Notice", href: "/notice" },
      { label: "Gallery", href: "/gallery" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Join Us", href: "/join-us" },
      { label: "+880 1234 567890", href: "tel:+8801234567890" },
      { label: "info@bwkd.com", href: "mailto:info@bwkd.com" },
      { label: "123 Karate Street, Dhaka", href: "https://maps.google.com" },
    ],
  },
];

// Define social links
const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/bangladeshwadokaikaratedo",
    label: "Facebook",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@BangladeshWadokaiKaratedo",
    label: "YouTube",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/japanbdmartialart",
    label: "Facebook",
  },
  { icon: Youtube, href: "https://www.youtube.com/@jbmaa", label: "YouTube" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Don't render navigation and footer for dashboard pages
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div suppressHydrationWarning>
      {/* Theme meta tags - moving from head to meta component */}
      <meta
        name="theme-color"
        content="#dc2626"
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content="#111827"
        media="(prefers-color-scheme: dark)"
      />

      <div className={`${inter.className} bg-background text-foreground`}>
        {mounted && (
          <AuthProvider>
            <AccessibilityProvider>
              {!isDashboard && (
                <ResponsiveNavigation
                  logo="/bwkd-logo.png"
                  logoAlt="BWKD"
                  items={navItems}
                  cta={{ href: "/join-us", label: "Join Us" }}
                />
              )}

              <div
                className={`${
                  !isDashboard ? "pt-16 md:pt-20 pb-16 md:pb-0" : ""
                }`}
              >
                <main>{children}</main>
              </div>

              {!isDashboard && (
                <ResponsiveFooter
                  logo="/bwkd-logo.png"
                  logoAlt="BWKD"
                  description="Bangladesh Wadokai Karate Do - Empowering individuals through the art of Karate since 2013. Join our community and discover your potential."
                  columns={footerColumns}
                  socialLinks={socialLinks}
                  newsletter={false}
                  copyright={`© ${new Date().getFullYear()} Bangladesh Wadokai Karate Do. All rights reserved.`}
                />
              )}
            </AccessibilityProvider>
          </AuthProvider>
        )}
      </div>

      {/* Performance optimization scripts - moved outside HTML structure */}
      <script src="/performance-optimizations.js" defer />
      <script src="/image-optimization.js" defer />
    </div>
  );
}
