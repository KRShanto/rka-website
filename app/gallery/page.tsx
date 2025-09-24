"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Masonry from "react-masonry-css";
import { getGallery } from "@/actions/public";
import { Gallery } from "@prisma/client";

export default function GalleryComponent() {
  const [galleryImages, setGalleryImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<null | {
    src: string;
    alt: string;
  }>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fetch gallery images from database
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const gallery = await getGallery();
      setGalleryImages(gallery);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // Reset zoom when image changes
  useEffect(() => {
    if (selectedImage) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
  }, [selectedImage]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    if (delta < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Pan functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    handleResetZoom();
  };

  // Masonry breakpoint configuration
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Photo Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl"
          >
            Capturing moments of discipline, strength, and community
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No gallery images available yet.
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Check back soon for more photos!
              </p>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto -ml-4"
              columnClassName="pl-4 bg-clip-padding"
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="relative overflow-hidden rounded-lg cursor-pointer mb-4 group"
                  onClick={() =>
                    setSelectedImage({
                      src: image.url,
                      alt: "Gallery image",
                    })
                  }
                >
                  <div className="relative">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt="Gallery image"
                      width={400}
                      height={300}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      style={{ height: "auto" }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <ZoomIn className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Masonry>
          )}
        </div>
      </section>

      {/* Lightbox for viewing images */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black z-20 hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              <X size={24} />
            </button>

            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="bg-white rounded-full p-2 text-black hover:bg-gray-100 transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="bg-white rounded-full p-2 text-black hover:bg-gray-100 transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="bg-white rounded-full p-2 text-black hover:bg-gray-100 transition-colors"
                title="Reset zoom"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 left-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>

            {/* Image container */}
            <div
              className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) translate(${panX / zoom}px, ${
                    panY / zoom
                  }px)`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
              >
                <Image
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: "90vh", maxWidth: "90vw" }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              Scroll to zoom • Drag to pan
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .masonry-grid {
          display: flex;
          margin-left: -16px;
          width: auto;
        }

        .masonry-grid_column {
          padding-left: 16px;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}
