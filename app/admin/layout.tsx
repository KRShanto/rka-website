"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import {
  Settings,
  Users,
  FileText,
  BarChart3,
  Shield,
  Home,
  LogOut,
  Menu,
  X,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin navigation items
  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/branches", label: "Branch Management", icon: MapPin },
    { href: "/admin/content", label: "Content Management", icon: FileText },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/system", label: "System Settings", icon: Settings },
  ];

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && (!user?.isLoggedIn || !user?.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user?.isLoggedIn || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-red-600 dark:bg-red-700 text-white shadow-lg border-b border-red-500 fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-white hover:bg-red-500 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 flex justify-center md:justify-start items-center">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
              <Shield className="w-6 h-6" />
              <span className="font-bold text-lg hidden md:inline-block">
                BWKD Admin Panel
              </span>
              <span className="font-bold text-lg md:hidden">Admin</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          <div className="hidden md:flex items-center space-x-2 border-l border-white/20 pl-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-white/70">System Administrator</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white hover:bg-red-500"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 pt-16",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <div>
              <span className="font-medium block">{user?.name || "Admin"}</span>
              <span className="text-xs text-gray-500">Administrator</span>
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
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-3">
            Admin Panel
          </div>
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-0",
                "text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-300"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-3">
            Quick Links
          </div>

          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span>User Dashboard</span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span>Main Website</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
