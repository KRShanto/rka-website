// Add this script to ensure smooth scrolling to top when navigating
if (typeof window !== "undefined") {
  // When the page loads, scroll to top
  window.addEventListener("load", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // When clicking on internal links, scroll to top
  document.addEventListener("click", (e: MouseEvent) => {
    // Check if the clicked element is a link
    const link = (e.target as Element).closest("a") as HTMLAnchorElement;
    if (link && link.href && link.href.startsWith(window.location.origin)) {
      // If it's the same page (hash link), don't interfere
      if (link.href === window.location.href) {
        return;
      }

      // If it's the same page but different hash, don't interfere
      if (link.href.split("#")[0] === window.location.href.split("#")[0]) {
        return;
      }

      // For same-origin links, scroll to top after a small delay
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Create floating indicator element
    const createFloatingIndicator = (): HTMLDivElement => {
      const indicator = document.createElement("div");
      indicator.className = "floating-page-indicator";
      document.body.appendChild(indicator);
      return indicator;
    };

    const floatingIndicator: HTMLDivElement = createFloatingIndicator();

    // Get current page title
    const getCurrentPageTitle = (): string => {
      const pathname = window.location.pathname;
      if (pathname === "/") return "Home";

      // Get the page name from pathname
      const pageName = pathname.split("/")[1];
      if (!pageName) return "Home";

      // Capitalize first letter
      return pageName.charAt(0).toUpperCase() + pageName.slice(1);
    };

    floatingIndicator.textContent = getCurrentPageTitle();

    // Show/hide indicator based on scroll position
    let lastScrollTop: number = 0;
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop: number =
          window.pageYOffset || document.documentElement.scrollTop;

        // Show indicator when scrolling down past threshold
        if (scrollTop > 200 && scrollTop > lastScrollTop) {
          floatingIndicator.classList.add("visible");
        } else {
          floatingIndicator.classList.remove("visible");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      },
      { passive: true }
    );

    // Add a class to help with styling based on scroll position
    const updateNavbarClasses = (): void => {
      const navbar: HTMLElement | null = document.querySelector("header");
      const isScrolled: boolean = window.scrollY > 20;

      if (navbar) {
        if (isScrolled) {
          navbar.classList.add("scrolled");
          navbar.classList.remove("nav-red-bg");
        } else {
          navbar.classList.remove("scrolled");
          navbar.classList.add("nav-red-bg");
        }
      }
    };

    // Call initially and on scroll
    updateNavbarClasses();
    window.addEventListener("scroll", updateNavbarClasses, { passive: true });

    // Add subtle background to active nav items
    const enhanceActiveNavItems = (): void => {
      const currentPath: string = window.location.pathname;
      const navLinks: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll("nav a");

      navLinks.forEach((link: HTMLAnchorElement) => {
        const href = link.getAttribute("href");

        // Check if this link corresponds to current page
        if (
          (href === "/" && currentPath === "/") ||
          (href !== "/" && href && currentPath.startsWith(href))
        ) {
          // Add active classes
          link.classList.add("active-nav-indicator", "active");
          link.classList.add("active-page-dot");
          link.classList.add("active-nav-subtle-bg");

          // Add a small white dot before the active link text
          const linkText = link.textContent;
          if (linkText && !link.querySelector(".active-dot-indicator")) {
            const dotSpan = document.createElement("span");
            dotSpan.className =
              "active-dot-indicator inline-block w-1.5 h-1.5 bg-white dark:bg-white rounded-full mr-1.5 align-middle";
            link.insertBefore(dotSpan, link.firstChild);
          }
        }
      });
    };

    enhanceActiveNavItems();
  });
}
