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
import { Toaster } from "sonner";
import { AuthUser } from "@/lib/auth";

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
      { label: "info@rka.com", href: "mailto:info@rka.com" },
      { label: "123 Karate Street, Dhaka", href: "https://maps.google.com" },
    ],
  },
];

// Define social links
const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/ronikarateacademy",
    label: "Facebook",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@ronikarateacademy",
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
  user,
}: {
  children: React.ReactNode;
  user: AuthUser | null;
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
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div>
      <div className={`${inter.className} bg-background text-foreground`}>
        {mounted && (
          <AccessibilityProvider>
            {!isDashboard && !isAdmin && (
              <ResponsiveNavigation
                logo="/rka-logo.png"
                logoAlt="RKA"
                items={navItems}
                cta={{ href: "/join-us", label: "Join Us" }}
                user={user}
              />
            )}

            <main>{children}</main>

            {!isDashboard && !isAdmin && (
              <ResponsiveFooter
                logo="/rka-logo.png"
                logoAlt="RKA"
                description="Roni Karate Academy - Empowering individuals through the art of Karate since 2013. Join our community and discover your potential."
                columns={footerColumns}
                socialLinks={socialLinks}
                newsletter={false}
                copyright={`© ${new Date().getFullYear()} Roni Karate Academy. All rights reserved.`}
              />
            )}
          </AccessibilityProvider>
        )}
      </div>

      {/* Add Sonner Toaster component for toast notifications */}
      <Toaster position="top-right" closeButton richColors />
    </div>
  );
}
