"use client"

import { useState, useEffect } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useResponsive() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("xs")
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setWindowSize({ width, height })

      // Determine current breakpoint
      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl")
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl")
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg")
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md")
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint("sm")
      } else {
        setCurrentBreakpoint("xs")
      }
    }

    // Set initial values
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize, { passive: true })

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Helper functions
  const isXs = currentBreakpoint === "xs"
  const isSm = currentBreakpoint === "sm"
  const isMd = currentBreakpoint === "md"
  const isLg = currentBreakpoint === "lg"
  const isXl = currentBreakpoint === "xl"
  const is2Xl = currentBreakpoint === "2xl"

  const isMobile = isXs || isSm
  const isTablet = isMd || isLg
  const isDesktop = isXl || is2Xl

  const isSmallScreen = windowSize.width < 1024
  const isMediumScreen = windowSize.width >= 1024 && windowSize.width < 1280
  const isLargeScreen = windowSize.width >= 1280

  return {
    windowSize,
    currentBreakpoint,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
  }
}

