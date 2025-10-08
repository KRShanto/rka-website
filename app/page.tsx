"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll } from "framer-motion";
import { useRef, lazy, Suspense, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import HeroSection from "@/components/Hero";

// Optimized loading with placeholders for items below the fold
const LazyAchievementCard = lazy(() => import("@/components/AchievementCard"));

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Data: latest achievements and gallery
  const [achievements, setAchievements] = useState<
    import("@prisma/client").Achievement[]
  >([]);
  const [galleryImages, setGalleryImages] = useState<
    import("@prisma/client").Gallery[]
  >([]);
  const [loading, setLoading] = useState({
    achievements: true,
    gallery: true,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [{ getAchievements }, { getGallery }] = await Promise.all([
          import("@/actions/public"),
          import("@/actions/public"),
        ]);
        const [ach, gal] = await Promise.all([getAchievements(), getGallery()]);
        if (!mounted) return;
        setAchievements((ach || []).slice(0, 3));
        setGalleryImages((gal || []).slice(0, 8));
      } finally {
        if (!mounted) return;
        setLoading({ achievements: false, gallery: false });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background has-bottom-nav" ref={ref}>
      <HeroSection />

      <section className="py-10 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-12 text-foreground dark:text-white mobile-heading"
          >
            Why Choose RKA?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
            {[
              {
                title: "Discipline",
                icon: "/icon-discipline.jpeg",
                description:
                  "Develop mental and physical discipline through rigorous training.",
              },
              {
                title: "Fitness",
                icon: "/icon-fitness.png",
                description:
                  "Improve your overall fitness, strength, and flexibility.",
              },
              {
                title: "Community",
                icon: "/icon-community.jpg",
                description:
                  "Join a supportive community of like-minded individuals.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group text-center bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 transform hover-effect card-mobile-full mobile-card flex flex-col border border-gray-100 dark:border-gray-700"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <Image
                    src={item.icon || "/placeholder.svg"}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                    priority={true}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex-grow relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-4 w-12 h-1 bg-primary rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-12 text-secondary-foreground dark:text-white mobile-heading"
          >
            Upcoming Events
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              There are no upcoming events at the moment.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Please check back later for future events and activities.
            </p>
          </motion.div>

          <div className="text-center mt-6 sm:mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-effect mobile-btn"
            >
              <Link
                href="/notice"
                className="flex items-center justify-center gap-2"
              >
                View All Notices <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-12 text-foreground dark:text-white mobile-heading"
          >
            Latest Achievements
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {loading.achievements
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden h-full mobile-card"
                  >
                    <div className="h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                    <div className="p-4 sm:p-6 mobile-p-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              : achievements.map((item, index) => (
                  <Suspense
                    key={item.id}
                    fallback={
                      <div className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden h-full mobile-card">
                        <div className="h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        <div className="p-4 sm:p-6 mobile-p-4">
                          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                      </div>
                    }
                  >
                    <LazyAchievementCard
                      achievement={{
                        title: item.title,
                        event: item.description,
                        image: item.imageUrl || "/placeholder.svg",
                      }}
                      index={index}
                    />
                  </Suspense>
                ))}
          </div>
          <div className="text-center mt-6 sm:mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-effect mobile-btn"
            >
              <Link
                href="/achievements"
                className="flex items-center justify-center gap-2"
              >
                View All Achievements <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-12 text-secondary-foreground dark:text-white mobile-heading"
          >
            Photo Gallery
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mobile-gap-4">
            {loading.gallery
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg aspect-square animate-optimized"
                  >
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  </div>
                ))
              : galleryImages.map((img, index) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, zIndex: 1 }}
                    className="relative overflow-hidden rounded-lg aspect-square animate-optimized"
                  >
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`RKA gallery image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300"
                      loading={index < 4 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </motion.div>
                ))}
          </div>
          <div className="text-center mt-6 sm:mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-effect mobile-btn"
            >
              <Link
                href="/gallery"
                className="flex items-center justify-center gap-2"
              >
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
