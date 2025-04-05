"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AccessibilityContextType {
  highContrast: boolean
  toggleHighContrast: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  largeText: boolean
  toggleLargeText: () => void
  focusVisible: boolean
  toggleFocusVisible: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: false,
  toggleHighContrast: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
  largeText: false,
  toggleLargeText: () => {},
  focusVisible: true,
  toggleFocusVisible: () => {},
})

export function useAccessibility() {
  return useContext(AccessibilityContext)
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [focusVisible, setFocusVisible] = useState(true)

  // Initialize from localStorage or system preferences
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check localStorage first
    const storedHighContrast = localStorage.getItem("highContrast")
    const storedReducedMotion = localStorage.getItem("reducedMotion")
    const storedLargeText = localStorage.getItem("largeText")
    const storedFocusVisible = localStorage.getItem("focusVisible")

    // Set from localStorage if available
    if (storedHighContrast) setHighContrast(storedHighContrast === "true")
    if (storedReducedMotion) setReducedMotion(storedReducedMotion === "true")
    if (storedLargeText) setLargeText(storedLargeText === "true")
    if (storedFocusVisible) setFocusVisible(storedFocusVisible === "true")

    // Otherwise check system preferences
    if (!storedReducedMotion) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setReducedMotion(prefersReducedMotion)
    }

    // Apply settings to document
    document.documentElement.classList.toggle("high-contrast", highContrast)
    document.documentElement.classList.toggle("reduced-motion", reducedMotion)
    document.documentElement.classList.toggle("large-text", largeText)
    document.documentElement.classList.toggle("focus-visible", focusVisible)
  }, [highContrast, reducedMotion, largeText, focusVisible])

  // Update document classes when settings change
  useEffect(() => {
    if (typeof window === "undefined") return

    document.documentElement.classList.toggle("high-contrast", highContrast)
    localStorage.setItem("highContrast", String(highContrast))
  }, [highContrast])

  useEffect(() => {
    if (typeof window === "undefined") return

    document.documentElement.classList.toggle("reduced-motion", reducedMotion)
    localStorage.setItem("reducedMotion", String(reducedMotion))
  }, [reducedMotion])

  useEffect(() => {
    if (typeof window === "undefined") return

    document.documentElement.classList.toggle("large-text", largeText)
    localStorage.setItem("largeText", String(largeText))
  }, [largeText])

  useEffect(() => {
    if (typeof window === "undefined") return

    document.documentElement.classList.toggle("focus-visible", focusVisible)
    localStorage.setItem("focusVisible", String(focusVisible))
  }, [focusVisible])

  const toggleHighContrast = () => setHighContrast((prev) => !prev)
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev)
  const toggleLargeText = () => setLargeText((prev) => !prev)
  const toggleFocusVisible = () => setFocusVisible((prev) => !prev)

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        reducedMotion,
        toggleReducedMotion,
        largeText,
        toggleLargeText,
        focusVisible,
        toggleFocusVisible,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

