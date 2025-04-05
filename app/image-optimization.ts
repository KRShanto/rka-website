// Image optimization script
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Function to optimize all images on the page
    const optimizeImages = (): void => {
      const images: NodeListOf<HTMLImageElement> = document.querySelectorAll(
        "img:not([data-optimized])"
      );

      if ("loading" in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach((img: HTMLImageElement) => {
          // Skip already optimized images
          if (img.hasAttribute("data-optimized")) return;

          // Add lazy loading
          if (
            !img.hasAttribute("loading") &&
            !img.closest(".hero-section, .primary-content")
          ) {
            img.loading = "lazy";
          }

          // Add decoding async
          if (!img.hasAttribute("decoding")) {
            img.decoding = "async";
          }

          // Add fetchpriority
          if (!img.hasAttribute("fetchpriority")) {
            if (img.closest(".hero-section, .primary-content")) {
              (img as any).fetchPriority = "high";
            } else {
              (img as any).fetchPriority = "low";
            }
          }

          // Mark as optimized
          img.setAttribute("data-optimized", "true");
        });
      } else {
        // Fallback for browsers without native lazy loading
        const lazyLoadImages = (): void => {
          const lazyImages: NodeListOf<HTMLImageElement> =
            document.querySelectorAll("img[data-src]");
          const imageObserver = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
              entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                  const img = entry.target as HTMLImageElement;
                  if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                  }
                  imageObserver.unobserve(img);
                }
              });
            }
          );

          lazyImages.forEach((img: HTMLImageElement) => {
            imageObserver.observe(img);
          });
        };

        // Convert regular images to lazy loaded
        images.forEach((img: HTMLImageElement) => {
          // Skip already optimized images
          if (img.hasAttribute("data-optimized")) return;

          // Skip images in important areas
          if (img.closest(".hero-section, .primary-content")) {
            img.setAttribute("data-optimized", "true");
            return;
          }

          // Store original src
          const src = img.src;
          img.setAttribute("data-src", src);

          // Set placeholder or low-quality image
          img.src =
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';

          // Mark as optimized
          img.setAttribute("data-optimized", "true");
        });

        // Initialize lazy loading
        if ("IntersectionObserver" in window) {
          lazyLoadImages();
        } else {
          // Fallback for older browsers
          images.forEach((img: HTMLImageElement) => {
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
          });
        }
      }
    };

    // Run optimization
    optimizeImages();

    // Re-run optimization when content changes (e.g., after AJAX)
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      let shouldOptimize = false;

      mutations.forEach((mutation: MutationRecord) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i] as Node;
            if (
              node.nodeName === "IMG" ||
              (node.nodeType === 1 && (node as Element).querySelector("img"))
            ) {
              shouldOptimize = true;
              break;
            }
          }
        }
      });

      if (shouldOptimize) {
        optimizeImages();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
