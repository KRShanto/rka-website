"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"

// Update the galleryImages array by adding the new image at the beginning
const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%2011.jpg-DvGpKoK1o4shrAZ99t7FZ7wSCZCnWI.jpeg",
    alt: "Karate instructor raising a young student's arm in victory, both wearing white gi with the student having an orange belt",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%201.jpg-9shw1zttlVYAsTDypCH2MH7WLyHIwB.jpeg",
    alt: "BWKD team members in formal attire at an event",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%202.jpg-s6VKFyKCk5dX7L1PxK2g7Nxmc0wCRd.jpeg",
    alt: "BWKD students in formal attire with red ties",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%203.jpg-uDgFM6eMVuab78PZrnPRCuxFVY1ZO3.jpeg",
    alt: "Award ceremony with trophies and officials",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%204.jpg-bnBUeF1UUlR9h2iI8B8AaLQCQC15m9.jpeg",
    alt: "Young karate students smiling together",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%205.jpg-oCVDJ2lOUC6j4xr79xyQZ2LRhDLVBP.jpeg",
    alt: "Karate practitioners receiving awards",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%206.jpg-v01o6n4mwZQtsUTsxiwKVSvhHRZh7R.jpeg",
    alt: "Karate practitioners at a ceremony",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%207.jpg-6ti1nH0kup4LZQGyOiVyxuxT93TjVj.jpeg",
    alt: "BWKD team with medals at a competition",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%208.jpg-tOIAGWTpTRFJcA2Qh6g0GERUxm80LJ.jpeg",
    alt: "Karate practitioner with trophy and medal",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%209.jpg-o0cwKl6g4ZNCApKawh8Fe46d6FggNs.jpeg",
    alt: "Karate athlete with medal in national colors",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/demo%2010.jpg-NYdtLYozhyrGsaGwhvdivCQKt6COEO.jpeg",
    alt: "Two karate practitioners showing gold medals",
  },
  // Keep some of the previous images
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    alt: "Karate training session",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    alt: "Karate competition",
  },
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<null | {
    src: string
    alt: string
  }>(null)

  return (
    <div className="bg-background min-h-screen pt-16">
      <section className="bg-primary dark:bg-gray-900 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Photo Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Capturing moments of discipline, strength, and community
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-lg aspect-square cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox for viewing images */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-auto">
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black z-10"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
            >
              <X size={24} />
            </button>
            <div className="relative w-full" style={{ height: "80vh" }}>
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-white text-center mt-4">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  )
}

