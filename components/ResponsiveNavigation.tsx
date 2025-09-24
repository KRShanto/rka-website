"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, User, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  children?: NavItem[];
}

interface ResponsiveNavigationProps {
  logo: string;
  logoAlt: string;
  items: NavItem[];
  cta?: {
    href: string;
    label: string;
  };
  user: AuthUser | null;
}

export default function ResponsiveNavigation({
  logo,
  logoAlt,
  items,
  cta,
  user,
}: ResponsiveNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Toggle submenu
  const toggleSubmenu = (href: string) => {
    setActiveSubmenu(activeSubmenu === href ? null : href);
  };

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  // Filter out login item if user is logged in
  const filteredItems = items.filter(
    (item) => !(user && item.href === "/login")
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white dark:bg-gray-900",
        scrolled && "shadow-md"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Mobile Left Button (Menu) */}
          <div className="md:hidden">
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-200",
                "hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:outline-none"
              )}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="block h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Logo - Centered on mobile */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link
              href="/"
              className="flex items-center space-x-2 focus:outline-none focus-visible:outline-none"
            >
              <Image
                src={logo || "/placeholder.svg"}
                alt={logoAlt}
                width={48}
                height={48}
                className="h-10 w-auto"
                priority
              />
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {logoAlt}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center space-x-1 py-1.5 focus:outline-none focus-visible:outline-none relative group",
                      isActive(item.href)
                        ? "text-primary font-medium"
                        : "text-gray-700 dark:text-gray-200",
                      "transition-colors duration-200"
                    )}
                    onClick={() => toggleSubmenu(item.href)}
                    aria-expanded={activeSubmenu === item.href}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 rounded-full"></span>
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-primary"></span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-1.5 focus:outline-none focus-visible:outline-none relative group",
                      isActive(item.href)
                        ? "text-primary font-medium"
                        : "text-gray-700 dark:text-gray-200",
                      "transition-colors duration-200"
                    )}
                  >
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 rounded-full"></span>
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-primary"></span>
                    )}
                  </Link>
                )}

                {/* Dropdown for desktop */}
                {item.children && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-4 py-2 text-sm focus:outline-none focus-visible:outline-none",
                          isActive(child.href)
                            ? "text-primary font-medium bg-gray-50 dark:bg-gray-700 dark:text-white"
                            : "text-gray-700 dark:text-gray-200",
                          "hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Admin Link and Profile or CTA Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === "ADMIN" && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <Link href="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Link href="/dashboard">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </div>
            ) : (
              cta && (
                <Button
                  asChild
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              )
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </nav>

          {/* Mobile Right Button (Theme Toggle) */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-gray-900 transform transition-transform ease-in-out duration-300 md:hidden",
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Close button - positioned at the top */}
        <div className="flex justify-end p-4 pt-16">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="block h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="pb-6 px-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            {filteredItems.map((item) => (
              <div key={item.href} className="py-1">
                {item.children ? (
                  <>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-3 rounded-md text-left focus:outline-none focus-visible:outline-none",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-white"
                          : "text-gray-700 dark:text-gray-200",
                        "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      onClick={() => toggleSubmenu(item.href)}
                      aria-expanded={activeSubmenu === item.href}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 transition-transform",
                          activeSubmenu === item.href
                            ? "transform rotate-180"
                            : ""
                        )}
                      />
                    </button>

                    {/* Mobile Submenu */}
                    {activeSubmenu === item.href && (
                      <div className="mt-1 pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-3 py-2 rounded-md focus:outline-none focus-visible:outline-none",
                              isActive(child.href)
                                ? "bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-white"
                                : "text-gray-700 dark:text-gray-200",
                              "hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md focus:outline-none focus-visible:outline-none",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-white"
                        : "text-gray-700 dark:text-gray-200",
                      "hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActive(item.href) && "text-primary"
                        )}
                      />
                    )}
                    <span>{item.label}</span>
                    {isActive(item.href) && (
                      <span className="ml-auto bg-primary/20 text-primary text-xs font-medium py-1 px-2 rounded-full">
                        Active
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Admin and Profile or CTA Button */}
            {user ? (
              <div className="space-y-2">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center px-3 py-3 rounded-md text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus-visible:outline-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Link>
              </div>
            ) : (
              cta && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Link
                      href={cta.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cta.label}
                    </Link>
                  </Button>
                </div>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
