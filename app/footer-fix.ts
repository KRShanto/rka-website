// Add this script to fix mobile footer links
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Fix for mobile footer social links
    const fixMobileFooterLinks = (): void => {
      const mobileFooterLinks: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll(".md\\:hidden .flex.space-x-4 a");

      if (mobileFooterLinks.length > 0) {
        mobileFooterLinks.forEach((link: HTMLAnchorElement) => {
          // Ensure links have proper z-index and position
          link.style.position = "relative";
          link.style.zIndex = "20";

          // Add click event listener to ensure proper navigation
          link.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            const href = link.getAttribute("href");
            if (href) {
              window.open(href, "_blank");
            }
          });
        });
      }
    };

    // Run the fix
    fixMobileFooterLinks();

    // Re-run the fix if the DOM changes (e.g., after accordion toggles)
    const observer = new MutationObserver(fixMobileFooterLinks);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
