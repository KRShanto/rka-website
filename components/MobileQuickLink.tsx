"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type LucideIcon, ArrowRight } from "lucide-react"

interface MobileQuickLinkProps {
  href: string
  label: string
  icon: LucideIcon
}

export default function MobileQuickLink({ href, label, icon: Icon }: MobileQuickLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If we're already on the same page, prevent default navigation
    // and just scroll to top
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-3 rounded-xl transition-all duration-200 touch-ripple mobile-tap-target",
        isActive
          ? "bg-primary/10 dark:bg-primary/20 mobile-nav-active"
          : "hover:bg-primary/5 dark:hover:bg-gray-700/30",
        "active:scale-[0.98]",
      )}
      onClick={handleClick}
    >
      <Icon
        className={cn(
          "w-5 h-5 mr-3",
          isActive ? "text-primary dark:text-primary" : "text-primary/70 dark:text-primary-foreground/70",
        )}
      />
      <span className={cn("text-gray-800 dark:text-gray-200", isActive && "font-medium")}>{label}</span>
      <ArrowRight size={16} className="ml-auto text-gray-400 dark:text-gray-500" />
    </Link>
  )
}

