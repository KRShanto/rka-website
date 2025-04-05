"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MobileNavLinkProps {
  href: string
  label: string
  icon: LucideIcon
  onClick?: () => void
  description?: string
}

// Simplified MobileNavLink for better performance
export default function MobileNavLink({ href, label, icon: Icon, onClick, description }: MobileNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  // Simplified click handler
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick()

    // If we're already on the same page, prevent default navigation
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo(0, 0) // Simple scroll to top without animation
    }
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-3 px-4 rounded-xl",
        isActive
          ? "bg-primary/10 text-primary font-medium dark:bg-primary/20 dark:text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/50",
      )}
      onClick={handleClick}
    >
      <div className="w-8 h-8 flex items-center justify-center mr-3">
        <Icon className="w-5 h-5" />
      </div>
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto bg-primary/20 dark:bg-primary/30 text-primary dark:text-white text-xs font-medium py-1 px-2 rounded-full">
          Active
        </span>
      )}
    </Link>
  )
}

