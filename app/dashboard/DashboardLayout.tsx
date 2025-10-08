"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  IdCard,
  CreditCard,
  History,
  Home,
  Shield,
  Bell,
  Settings,
  Menu,
  X,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { DbUser } from "@/lib/auth";

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: DbUser;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Close sidebar on route change
    setSidebarOpen(false);
  }, [pathname]);

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
    ...(user?.role === "ADMIN"
      ? [{ href: "/admin", label: "Admin Panel", icon: Shield }]
      : []),
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  async function logout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (res.ok) {
        console.log("Logout successful");
        router.push("/login");
        // Hard refresh to clear any cached data
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

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
              src="/rka-logo.png"
              alt="RKA"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
            <span className="font-bold text-lg hidden md:inline-block">
              RKA Admin Dashboard
            </span>
            <span className="font-bold text-lg md:hidden">RKA Admin</span>
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
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              {user?.imageUrl ? (
                <Image
                  src={user?.imageUrl}
                  alt="User"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              ) : (
                <UserIcon className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <div className="flex items-center space-x-1">
                {user?.role === "ADMIN" && (
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
            <UserIcon className="w-5 h-5 text-primary" />
            <div>
              <span className="font-medium block">{user?.name || "Admin"}</span>
              <div className="flex items-center space-x-1">
                {user?.role === "ADMIN" && (
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
