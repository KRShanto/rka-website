"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, lazy, Suspense } from "react"
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@/hooks/use-media-query"

// Dynamically import components based on screen size
const MobileHeroSection = dynamic(() => import("@/components/MobileHeroSection"), { ssr: false })

// Optimized loading with placeholders for items below the fold
const LazyEventCard = lazy(() => import("@/components/EventCard"))
const LazyAchievementCard = lazy(() => import("@/components/AchievementCard"))

export default function Home() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="min-h-screen bg-background has-bottom-nav" ref={ref}>
      {isMobile ? (
        <MobileHeroSection />
      ) : (
        <motion.section
          className="relative bg-cover bg-center h-[80vh] sm:h-screen flex items-center overflow-hidden"
          style={{
            opacity,
            scale,
          }}
        >
          <div className="absolute inset-0 bwkd-logo-banner"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 container mx-auto text-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 dark:text-white"
            >
              Bangladesh Wadokai Karate Do
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 dark:text-gray-200 max-w-3xl mx-auto"
            >
              Discover the art of Karate and embark on a journey of self-discipline and mastery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 sm:px-8 py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-effect"
              >
                <Link href="/join-us" className="flex items-center gap-2">
                  Join Us <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 dark:bg-gray-800/10 dark:text-white dark:hover:bg-gray-800/20 font-bold px-6 sm:px-8 py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-effect"
              >
                <Link href="/about" className="flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      )}

      <section className="py-10 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-12 text-foreground dark:text-white mobile-heading"
          >
            Why Choose BWKD?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
            {[
              {
                title: "Discipline",
                icon: "/icon-discipline.jpeg",
                description: "Develop mental and physical discipline through rigorous training.",
              },
              {
                title: "Fitness",
                icon: "/icon-fitness.png",
                description: "Improve your overall fitness, strength, and flexibility.",
              },
              {
                title: "Community",
                icon: "/icon-community.jpg",
                description: "Join a supportive community of like-minded individuals.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover-effect card-mobile-full mobile-card flex flex-col"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={item.icon || "/placeholder.svg"}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                    priority={true}
                  />
                </div>
                <div className="p-5 sm:p-6 flex-grow">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
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
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">There are no upcoming events at the moment.</p>
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
              <Link href="/notice" className="flex items-center justify-center gap-2">
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
            {[
              {
                title: "Second Runner-up in Sri Lanka",
                event: "International Karate Championship 2025",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/srilanka_cover.jpg-wticOZ20o01EhCFt8BlqrvpSXNFPyr.jpeg",
              },
              {
                title: "Champion's Trophy",
                event: "Narayanganj District 9th Open Karate Championship 2025",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ng_cover.jpg-qxMAklfiAFty8eaRC998kUhHFIqHrQ.jpeg",
              },
              {
                title: "107 Medals",
                event: "First Open Gendaria Martial Arts Championship 2024",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gandari_cover.jpg-2CudSIBTKMkDFAboMeqHGvANQDnlyA.jpeg",
              },
            ].map((achievement, index) => (
              <Suspense
                key={achievement.title}
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
                <LazyAchievementCard achievement={achievement} index={index} />
              </Suspense>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-effect mobile-btn"
            >
              <Link href="/achievements" className="flex items-center justify-center gap-2">
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
            {[
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%2011.jpg-DvGpKoK1o4shrAZ99t7FZ7wSCZCnWI.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%201.jpg-9shw1zttlVYAsTDypCH2MH7WLyHIwB.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%202.jpg-s6VKFyKCk5dX7L1PxK2g7Nxmc0wCRd.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%203.jpg-uDgFM6eMVuab78PZrnPRCuxFVY1ZO3.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%204.jpg-bnBUeF1UUlR9h2iI8B8AaLQCQC15m9.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%205.jpg-oCVDJ2lOUC6j4xr79xyQZ2LRhDLVBP.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%206.jpg-v01o6n4mwZQtsUTsxiwKVSvhHRZh7R.jpeg",
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%207.jpg-6ti1nH0kup4LZQGyOiVyxuxT93TjVj.jpeg",
            ].map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, zIndex: 1 }}
                className="relative overflow-hidden rounded-lg aspect-square animate-optimized"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`BWKD gallery image ${index + 1}`}
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
              <Link href="/gallery" className="flex items-center justify-center gap-2">
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

