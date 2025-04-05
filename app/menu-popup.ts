// This script enhances the mobile menu pop-up behavior
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Get references to menu elements
    const menuButton: HTMLElement | null = document.querySelector(
      ".navbar-menu-button"
    );
    const mobileMenu: HTMLElement | null =
      document.getElementById("mobile-menu");
    const closeButton: HTMLButtonElement | null = mobileMenu
      ? mobileMenu.querySelector("button")
      : null;

    // Function to handle menu opening with pop-up effect
    const openMenu = (): void => {
      // Make sure the menu is visible
      if (mobileMenu) {
        mobileMenu.classList.remove("hidden");

        // Create overlay if it doesn't exist
        let overlay: HTMLElement | null = document.querySelector(
          ".mobile-menu-overlay"
        );
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "mobile-menu-overlay";
          document.body.appendChild(overlay);

          // Add click handler to close menu when overlay is clicked
          overlay.addEventListener("click", closeMenu);
        }

        // Ensure overlay is visible
        overlay.classList.remove("hidden");

        // Prevent body scrolling
        document.body.style.overflow = "hidden";

        // Add pop-up animation to menu items
        const menuItems: NodeListOf<HTMLElement> = mobileMenu.querySelectorAll(
          ".mobile-menu-item-animate"
        );
        menuItems.forEach((item: HTMLElement, index: number) => {
          // Reset animation
          item.style.animation = "none";
          item.offsetHeight; // Trigger reflow
          item.style.animation = "";
        });
      }
    };

    // Function to handle menu closing
    const closeMenu = (): void => {
      if (mobileMenu) {
        mobileMenu.classList.add("hidden");

        // Hide overlay
        const overlay: HTMLElement | null = document.querySelector(
          ".mobile-menu-overlay"
        );
        if (overlay) {
          overlay.classList.add("hidden");
        }

        // Restore body scrolling
        document.body.style.overflow = "";
      }
    };

    // Add event listeners
    if (menuButton) {
      menuButton.addEventListener("click", openMenu);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    // Handle ESC key to close menu
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        mobileMenu &&
        !mobileMenu.classList.contains("hidden")
      ) {
        closeMenu();
      }
    });

    // Fix for iOS devices
    const isIOS: boolean =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      // Add iOS-specific class
      document.documentElement.classList.add("ios-device");

      // Fix for iOS position:fixed issues
      if (mobileMenu) {
        mobileMenu.style.height = "100%";
        mobileMenu.style.position = "fixed";
      }
    }
  });
}
