"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar } from "lucide-react"

interface EventCardProps {
  event: {
    title: string
    image: string
    date: string
    description: string
  }
  index: number
}

export default function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden h-full mobile-card"
    >
      <div className="relative h-48 sm:h-56 md:h-64">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
          loading={index < 3 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center text-white text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date}</span>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 mobile-p-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{event.description}</p>
      </div>
    </motion.div>
  )
}

