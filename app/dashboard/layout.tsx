"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  CreditCard,
  History,
  BadgeIcon as IdCard,
  LogOut,
  Menu,
  User,
  X,
  Bell,
  Settings,
  Home,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Close sidebar on route change
    setSidebarOpen(false);
  }, [pathname]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user?.isLoggedIn) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { href: "/dashboard", label: "ID", icon: IdCard },
    { href: "/dashboard/payment", label: "Payment", icon: CreditCard },
    {
      href: "/dashboard/payment-history",
      label: "Payment History",
      icon: History,
    },
  ];

  const topNavItems = [
    { href: "/", label: "Main Site", icon: Home },
    ...(user?.isAdmin
      ? [{ href: "/admin", label: "Admin Panel", icon: Shield }]
      : []),
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navbar */}
      <header className="bg-primary dark:bg-gray-800 text-white shadow-sm border-b border-white/20 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-white hover:bg-primary-foreground/20 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 flex justify-center md:justify-start items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/bwkd-logo.png"
              alt="BWKD"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
            <span className="font-bold text-lg hidden md:inline-block">
              BWKD Admin Dashboard
            </span>
            <span className="font-bold text-lg md:hidden">BWKD Admin</span>
          </Link>
        </div>

        {/* Top Navigation Items */}
        <div className="hidden md:flex items-center space-x-4 mx-4">
          {topNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-white hover:bg-primary-foreground/20 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          <div className="hidden md:flex items-center space-x-2 border-l border-white/20 pl-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-white/70 capitalize">
                  {user?.role || "Student"}
                </p>
                {user?.isAdmin && (
                  <span className="text-xs bg-yellow-500 text-black px-1 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white hover:bg-primary-foreground/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 pt-16",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <div>
              <span className="font-medium block">{user?.name || "Admin"}</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "Student"}
                </span>
                {user?.isAdmin && (
                  <span className="text-xs bg-yellow-500 text-black px-1 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {/* Top Navigation Items - Only visible on mobile in sidebar */}
          <div className="md:hidden space-y-1 mb-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
              Quick Links
            </div>
            {topNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-0",
                  pathname === item.href
                    ? "text-primary font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
          </div>

          {/* Main Navigation Items */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2 md:hidden">
              Dashboard
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-0",
                  pathname === item.href
                    ? "text-primary font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-4 py-3 rounded-md transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
