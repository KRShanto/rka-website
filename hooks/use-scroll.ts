"use client"

import { useState, useEffect } from "react"

export function useScroll() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    // Optimized scroll handler with debounce
    const timeoutId: NodeJS.Timeout | null = null
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // Check if scrolled past threshold
          setScrolled(currentScrollY > 50)

          // Only hide navbar when scrolling down significantly
          if (currentScrollY > lastScrollY + 10 && currentScrollY > 150) {
            setVisible(false)
          } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 100) {
            setVisible(true)
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })

        ticking = true
      }
    }

    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [lastScrollY])

  return { scrolled, visible }
}

