"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Info, MapPinned, Users, Menu } from "lucide-react"
import Image from "next/image"

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/about", label: "About", icon: Info },
    { href: "/branches", label: "Branches", icon: MapPinned },
    { href: "/trainers", label: "Trainers", icon: Users },
    { href: "/achievements", label: "More", icon: Menu },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 shadow-lg pb-safe">
      <div className="grid grid-cols-5 h-16">
        <Link href="/" className="flex items-center justify-center">
          <div className="relative h-8 w-8">
            <Image src="/bwkd-logo.png" alt="BWKD Logo" layout="fill" objectFit="contain" priority />
          </div>
        </Link>
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive ? "text-primary dark:text-white" : "text-gray-500 dark:text-gray-400",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
              {isActive && <span className="absolute top-0 h-1 w-8 bg-primary rounded-b-full" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

