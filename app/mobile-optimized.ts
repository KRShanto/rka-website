// Optimized mobile script with minimal overhead
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Basic touch handling for mobile menu
    const menuButton: HTMLElement | null = document.querySelector(
      ".navbar-menu-button"
    );
    const mobileMenu: HTMLElement | null =
      document.getElementById("mobile-menu");
    const closeButton: HTMLElement | null = mobileMenu
      ? mobileMenu.querySelector("button")
      : null;

    // Simple toggle function
    const toggleMenu = (show: boolean): void => {
      if (mobileMenu) {
        if (show) {
          mobileMenu.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        } else {
          mobileMenu.classList.add("hidden");
          document.body.style.overflow = "";
        }
      }
    };

    // Add event listeners with minimal overhead
    if (menuButton) {
      menuButton.addEventListener("click", () => toggleMenu(true));
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => toggleMenu(false));
    }

    // Handle ESC key
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        mobileMenu &&
        !mobileMenu.classList.contains("hidden")
      ) {
        toggleMenu(false);
      }
    });

    // Optimize scrolling
    const optimizeScroll = (): void => {
      // Use requestAnimationFrame for smooth scrolling
      let ticking = false;

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              // Handle any scroll-based UI updates here
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    };

    optimizeScroll();

    // Optimize image loading
    const lazyLoadImages = (): void => {
      if ("loading" in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll("img").forEach((img: HTMLImageElement) => {
          if (!img.loading) {
            img.loading = "lazy";
          }
        });
      }
    };

    lazyLoadImages();
  });
}
