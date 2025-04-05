"use client"

import { useState } from "react"
import { useAccessibility } from "./AccessibilityProvider"
import { Button } from "@/components/ui/button"
import { Eye, Type, ZoomIn, MousePointer, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    largeText,
    toggleLargeText,
    focusVisible,
    toggleFocusVisible,
  } = useAccessibility()

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground shadow-lg"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
      >
        <Eye className="h-5 w-5" />
      </Button>

      {/* Accessibility Menu */}
      <div
        className={cn(
          "absolute bottom-16 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 w-64 transition-all duration-200",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900 dark:text-white">Accessibility</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">High Contrast</span>
            </div>
            <Button
              variant={highContrast ? "default" : "outline"}
              size="sm"
              onClick={toggleHighContrast}
              className="h-8"
            >
              {highContrast ? "On" : "Off"}
            </Button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Reduced Motion</span>
            </div>
            <Button
              variant={reducedMotion ? "default" : "outline"}
              size="sm"
              onClick={toggleReducedMotion}
              className="h-8"
            >
              {reducedMotion ? "On" : "Off"}
            </Button>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Type className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Large Text</span>
            </div>
            <Button variant={largeText ? "default" : "outline"} size="sm" onClick={toggleLargeText} className="h-8">
              {largeText ? "On" : "Off"}
            </Button>
          </div>

          {/* Focus Visible */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ZoomIn className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Focus Outlines</span>
            </div>
            <Button
              variant={focusVisible ? "default" : "outline"}
              size="sm"
              onClick={toggleFocusVisible}
              className="h-8"
            >
              {focusVisible ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

