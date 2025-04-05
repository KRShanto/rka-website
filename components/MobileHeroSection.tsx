"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function MobileHeroSection() {
  return (
    <section className="relative bg-cover bg-center h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bwkd-logo-banner"></div>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 container mx-auto text-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold mb-4 dark:text-white"
        >
          Bangladesh Wadokai Karate Do
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base mb-6 dark:text-gray-200 max-w-3xl mx-auto"
        >
          Discover the art of Karate and embark on a journey of self-discipline and mastery.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3 flex flex-col"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover-effect rounded-xl"
          >
            <Link href="/join-us" className="flex items-center justify-center gap-2">
              Join Us <ArrowRight size={16} />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20 dark:bg-gray-800/10 dark:text-white dark:hover:bg-gray-800/20 font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover-effect rounded-xl"
          >
            <Link href="/about" className="flex items-center justify-center gap-2">
              Learn More <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

