"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play, Award, Users, Trophy } from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";

interface HeroStat {
  icon: React.ElementType;
  value: string;
  label: string;
}

const heroStats: HeroStat[] = [
  { icon: Users, value: "1000+", label: "Students" },
  { icon: Award, value: "12+", label: "Years" },
  { icon: Trophy, value: "500+", label: "Medals" },
];

// HD AI-generated karate images that will auto-scroll
const karateImages = [
  {
    src: "/hero/karate1.png",
    alt: "Karate practitioner in white gi performing kata",
  },
  {
    src: "/hero/karate2.png",
    alt: "Martial arts training session",
  },
  {
    src: "/hero/karate3.png",
    alt: "Karate belt and uniform",
  },
  {
    src: "/hero/karate4.png",
    alt: "Karate dojo training",
  },
  {
    src: "/hero/karate5.png",
    alt: "Traditional karate stance",
  },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % karateImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // Mobile Hero Section
  if (isMobile) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <Image
              src="/rka-logo.png"
              alt="RKA Logo"
              width={120}
              height={120}
              className="w-24 h-24 sm:w-28 sm:h-28"
              priority
            />
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3 mb-6"
          >
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">Roni</span>
              <br />
              <span className="text-primary">Karate Academy</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed px-4 max-w-md mx-auto">
              Join Bangladesh's premier karate organization and discover your
              potential.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-3 mb-6"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 text-base w-full max-w-xs group"
            >
              <Link
                href="/join-us"
                className="flex items-center justify-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 text-base w-full max-w-xs"
            >
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </motion.div>

          {/* Mobile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-3 max-w-sm mx-auto"
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop Hero Section
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Simplified */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Heading - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-start mb-6"
              >
                <Image
                  src="/rka-logo.png"
                  alt="RKA Logo"
                  width={150}
                  height={150}
                  className="w-32 h-32 lg:w-36 lg:h-36"
                  priority
                />
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Roni</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
                  Karate Academy
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                Join Bangladesh's premier karate organization and discover your
                potential.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Link href="/join-us" className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4 text-lg transition-all duration-300"
              >
                <Link href="/gallery" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  View Gallery
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Images - Auto-scrolling HD Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative h-[600px] w-full overflow-hidden rounded-2xl shadow-2xl">
              {/* Main auto-scrolling image */}
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={
                    karateImages[currentImageIndex].src || "/placeholder.svg"
                  }
                  alt={karateImages[currentImageIndex].alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {karateImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-8"
                        : "bg-white/50"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
