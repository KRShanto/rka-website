// Performance optimizations for all devices
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Detect device type for device-specific optimizations
    const isMobile: boolean = window.innerWidth <= 640;
    const isTablet: boolean =
      window.innerWidth > 640 && window.innerWidth <= 1024;
    const isDesktop: boolean = window.innerWidth > 1024;

    // Add device class to body for CSS targeting
    if (isMobile) document.body.classList.add("is-mobile");
    if (isTablet) document.body.classList.add("is-tablet");
    if (isDesktop) document.body.classList.add("is-desktop");

    // Optimize images
    const optimizeImages = (): void => {
      const images: NodeListOf<HTMLImageElement> =
        document.querySelectorAll("img:not([loading])");

      images.forEach((img: HTMLImageElement) => {
        // Add native lazy loading
        if ("loading" in HTMLImageElement.prototype) {
          img.loading = "lazy";
        }

        // Add decoding async for better performance
        img.decoding = "async";

        // Add fetchpriority for important images
        if (img.closest(".hero-image, .primary-image")) {
          (img as any).fetchPriority = "high";
        } else {
          (img as any).fetchPriority = "low";
        }

        // Add srcset for responsive images if not already present
        if (!img.srcset && img.src && !img.src.includes("svg")) {
          const src = img.src;
          // Only add srcset if it's a regular image (not SVG or data URL)
          if (src.match(/\.(jpe?g|png|webp)/i)) {
            img.srcset = `${src} 1x, ${src.replace(
              /\.(jpe?g|png|webp)/,
              "@2x.$1"
            )} 2x`;
          }
        }
      });
    };

    // Optimize scrolling
    const optimizeScroll = (): void => {
      let ticking = false;
      let lastScrollY = window.scrollY;
      const scrollThreshold = 50;

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const currentScrollY = window.scrollY;
              const scrollDifference = Math.abs(currentScrollY - lastScrollY);

              // Only process scroll events that exceed the threshold
              if (scrollDifference > scrollThreshold) {
                // Update navbar visibility
                const navbar: HTMLElement | null =
                  document.querySelector(".navbar-container");
                if (navbar) {
                  if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.classList.add("-translate-y-full");
                  } else {
                    navbar.classList.remove("-translate-y-full");
                  }
                }

                // Update last scroll position
                lastScrollY = currentScrollY;
              }

              ticking = false;
            });

            ticking = true;
          }
        },
        { passive: true }
      );
    };

    // Optimize animations
    const optimizeAnimations = (): void => {
      // Reduce animations for mobile devices to improve performance
      if (isMobile) {
        document.body.classList.add("reduce-animations");
      }

      // Use Intersection Observer for animations
      const animatedElements: NodeListOf<Element> =
        document.querySelectorAll(".animate-on-scroll");

      if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(
          (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("animate-visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );

        animatedElements.forEach((el: Element) => observer.observe(el));
      }
    };

    // Optimize touch interactions
    const optimizeTouchInteractions = (): void => {
      if (isMobile || isTablet) {
        // Add touch feedback to interactive elements
        const touchElements: NodeListOf<Element> = document.querySelectorAll(
          "button, a, .interactive"
        );

        touchElements.forEach((el: Element) => {
          el.addEventListener(
            "touchstart",
            () => {
              el.classList.add("touch-active");
            },
            { passive: true }
          );

          el.addEventListener(
            "touchend",
            () => {
              el.classList.remove("touch-active");
            },
            { passive: true }
          );
        });
      }
    };

    // Optimize font loading
    const optimizeFontLoading = (): void => {
      // Add font-display: swap to all font faces
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-display: swap !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Run optimizations
    optimizeImages();
    optimizeScroll();
    optimizeAnimations();
    optimizeTouchInteractions();
    optimizeFontLoading();

    // Handle resize events for responsive behavior
    window.addEventListener(
      "resize",
      () => {
        const newIsMobile: boolean = window.innerWidth <= 640;
        const newIsTablet: boolean =
          window.innerWidth > 640 && window.innerWidth <= 1024;
        const newIsDesktop: boolean = window.innerWidth > 1024;

        // Update device classes if changed
        if (newIsMobile !== isMobile) {
          document.body.classList.toggle("is-mobile", newIsMobile);
        }

        if (newIsTablet !== isTablet) {
          document.body.classList.toggle("is-tablet", newIsTablet);
        }

        if (newIsDesktop !== isDesktop) {
          document.body.classList.toggle("is-desktop", newIsDesktop);
        }
      },
      { passive: true }
    );
  });
}
