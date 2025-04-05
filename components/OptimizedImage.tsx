"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  loading?: "lazy" | "eager"
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  objectFit = "cover",
  loading = "lazy",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true)
    }

    // Use Intersection Observer for better performance
    if ("IntersectionObserver" in window && !priority && loading === "lazy") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && imgRef.current) {
              imgRef.current.src = src
              observer.unobserve(entry.target)
            }
          })
        },
        { rootMargin: "200px" },
      )

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current)
        }
      }
    }
  }, [src, priority, loading])

  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (src.includes("svg") || src.includes("data:")) return undefined

    // For regular images, create responsive srcset
    return `${src} 1x, ${src.replace(/\.(jpe?g|png|webp)/, "@2x.$1")} 2x`
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "auto" }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{ aspectRatio: width && height ? width / height : undefined }}
        />
      )}

      <img
        ref={imgRef}
        src={
          priority
            ? src
            : loading === "lazy"
              ? "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
              : src
        }
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down",
        )}
        loading={priority ? "eager" : loading}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        srcSet={generateSrcSet()}
      />
    </div>
  )
}

