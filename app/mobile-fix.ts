// This script ensures the mobile menu works properly on all devices
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Helper function to fix z-index issues by forcing a repaint
    const fixZIndexIssues = (): void => {
      const mobileMenu: HTMLElement | null =
        document.getElementById("mobile-menu");
      if (mobileMenu) {
        // Force a repaint to ensure proper z-index stacking
        mobileMenu.style.display = "none";
        setTimeout(() => {
          mobileMenu.style.display = "";
        }, 0);
      }
    };

    // Fix any iOS-specific issues
    const isIOS: boolean =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      // Add iOS-specific class to handle safe areas better
      document.documentElement.classList.add("ios-device");

      // Fix for iOS scroll issues when opening mobile menu
      const mobileMenuButton: HTMLElement | null = document.querySelector(
        ".navbar-menu-button"
      );
      if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
          fixZIndexIssues();
          // Prevent the fixed background from scrolling on iOS
          document.body.style.position = "fixed";
          document.body.style.width = "100%";
        });
      }

      // Reset body position when menu is closed
      const closeMenuButton: HTMLElement | null = document.querySelector(
        ".mobile-menu-container button"
      );
      if (closeMenuButton) {
        closeMenuButton.addEventListener("click", () => {
          document.body.style.position = "";
          document.body.style.width = "";
        });
      }
    }

    // Ensure menu button is always clickable
    const menuButton: HTMLElement | null = document.querySelector(
      ".navbar-menu-button"
    );
    if (menuButton) {
      // Increase touch target size
      menuButton.style.padding = "12px";

      // Fix any potential z-index issues
      menuButton.addEventListener("click", fixZIndexIssues);
    }

    // Fix for navbar visibility on scroll
    let lastScrollTop: number = 0;
    window.addEventListener(
      "scroll",
      () => {
        const st: number =
          window.pageYOffset || document.documentElement.scrollTop;
        const navbar: HTMLElement | null =
          document.querySelector(".navbar-container");
        if (navbar) {
          // Always show navbar when scrolling up
          if (st <= lastScrollTop || st < 50) {
            navbar.classList.remove("-translate-y-full");
            navbar.classList.add("translate-y-0");
          }
          lastScrollTop = st <= 0 ? 0 : st;
        }
      },
      { passive: true }
    );
  });
}
