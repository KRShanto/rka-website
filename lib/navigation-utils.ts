import type React from "react"
/**
 * Scrolls to the top of the page with smooth behavior
 */
export function scrollToTop() {
  try {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  } catch (error) {
    // Fallback for browsers that don't support smooth scrolling
    window.scrollTo(0, 0)
  }
}

/**
 * Handles navigation with scroll to top functionality
 * @param href The URL to navigate to
 * @param currentPath The current path
 * @param callback Optional callback function to execute
 * @returns A function to handle click events
 */
export function handleNavigation(href: string, currentPath: string, callback?: () => void) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (callback) callback()

    // If we're already on the same page, prevent default navigation
    // and just scroll to top
    if (currentPath === href) {
      e.preventDefault()
      scrollToTop()

      // Also ensure the navbar is visible
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.classList.remove("-translate-y-full")
        navbar.classList.add("translate-y-0")
      }
    }
  }
}

/**
 * Ensures the navbar is visible
 */
export function ensureNavbarVisible() {
  const navbar = document.querySelector(".navbar-container")
  if (navbar) {
    navbar.classList.remove("-translate-y-full")
    navbar.classList.add("translate-y-0")
  }
}

