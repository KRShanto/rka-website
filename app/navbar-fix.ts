// This script ensures the navbar is always accessible and fixes any potential issues
if (typeof window !== "undefined") {
  // Fix for iOS Safari where the navbar might be hidden under the status bar
  document.addEventListener("DOMContentLoaded", () => {
    // Add viewport-fit=cover to ensure the content extends to the edges of the screen
    const metaViewport: HTMLMetaElement | null = document.querySelector(
      'meta[name="viewport"]'
    );
    if (metaViewport) {
      metaViewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      );
    }

    // Ensure the navbar is always accessible by adding a tap handler to show it
    const mainContent: HTMLElement | null = document.querySelector("main");
    if (mainContent) {
      let lastTouchY: number = 0;

      mainContent.addEventListener(
        "touchstart",
        (e: TouchEvent) => {
          lastTouchY = e.touches[0].clientY;
        },
        { passive: true }
      );

      mainContent.addEventListener(
        "touchmove",
        (e: TouchEvent) => {
          const currentTouchY: number = e.touches[0].clientY;
          const navbar: HTMLElement | null =
            document.querySelector(".navbar-container");

          // If swiping down near the top of the screen, ensure navbar is visible
          if (currentTouchY > lastTouchY && currentTouchY < 100 && navbar) {
            navbar.classList.remove("-translate-y-full");
            navbar.classList.add("translate-y-0");
          }

          lastTouchY = currentTouchY;
        },
        { passive: true }
      );
    }
  });

  // Fix for dark mode consistency
  const applyDarkMode = (): void => {
    const isDarkMode: boolean =
      document.documentElement.classList.contains("dark");

    if (isDarkMode) {
      // Ensure all dark mode elements have consistent styling
      document.querySelectorAll(".navbar-dark").forEach((el: Element) => {
        el.classList.add("dark-mode-applied");
      });

      document.querySelectorAll(".mobile-menu-dark").forEach((el: Element) => {
        el.classList.add("dark-mode-applied");
      });

      document.querySelectorAll(".mobile-bottom-nav").forEach((el: Element) => {
        el.classList.add("dark-mode-applied");
      });
    } else {
      // Remove dark mode styling
      document.querySelectorAll(".dark-mode-applied").forEach((el: Element) => {
        el.classList.remove("dark-mode-applied");
      });
    }
  };

  // Apply dark mode styling when the page loads
  document.addEventListener("DOMContentLoaded", applyDarkMode);

  // Monitor for changes to dark mode
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      if (
        mutation.attributeName === "class" &&
        mutation.target === document.documentElement
      ) {
        applyDarkMode();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
}
