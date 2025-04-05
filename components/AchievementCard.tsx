"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Trophy } from "lucide-react"

interface AchievementCardProps {
  achievement: {
    title: string
    event: string
    image: string
  }
  index: number
}

export default function AchievementCard({ achievement, index }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-md h-full mobile-card"
    >
      <div className="relative h-48 sm:h-56 md:h-64">
        <Image
          src={achievement.image || "/placeholder.svg?height=300&width=500"}
          alt={achievement.title}
          fill
          className="object-cover"
          loading={index < 2 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const imgElement = e.currentTarget as HTMLImageElement
            imgElement.src = "/placeholder.svg?height=300&width=500"
          }}
        />
        <div className="absolute top-0 right-0 m-3">
          <div className="bg-primary/90 text-white p-2 rounded-full">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 mobile-p-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{achievement.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{achievement.event}</p>
      </div>
    </motion.div>
  )
}

