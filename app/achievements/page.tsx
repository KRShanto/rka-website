"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const achievements = [
  {
    title: "Second Runner-up in Sri Lanka",
    description:
      "BWKD achieved an outstanding performance at the International Karate Championship held in Sri Lanka on February 22nd and 23rd, 2025, securing a total of 12 gold, 1 silver, and 1 bronze medals, earning the honor of being the second runner-up in the team category",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/srilanka_cover.jpg-wticOZ20o01EhCFt8BlqrvpSXNFPyr.jpeg",
  },
  {
    title: "Bangladesh Wadokai Karate Do Achievement All Championship Trophy",
    description:
      "Change the country, change the world. Karate Tournament organized by the Bangladesh Karate Federation on the occasion of Tarunner Utsab 2025, February 8, 2025, with the aim of building a new Bangladesh. Bangladesh Wadokai Karate Do Achievement All Championship Trophy. This is a big achievement for our club. Good luck to all who participated in this event and brought outstanding results.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarun_cover.jpg-JrkLTrN6eOEpiJdBX9HzXv8R9I5KMD.jpeg",
  },
  {
    title: "Bangladesh Wadokai Karate do team achieved the Champion's Trophy",
    description:
      "Bangladesh Wadokai Karate do team achieved the Champion's Trophy and won 40 gold medals at the Narayanganj District 9th Open Karate Championship-2025",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ng_cover.jpg-qxMAklfiAFty8eaRC998kUhHFIqHrQ.jpeg",
  },
  {
    title: "Runner-Up Trophy from India's 26th Bongo Bhumi Cup International Karate Championship",
    description:
      "Bangladesh Wadokai Karate-Do proudly returns home with the Runner-Up Trophy from India's 26th Bongo Bhumi Cup International Karate Championship! This incredible achievement is a testament to our team's hard work, dedication, and unwavering spirit. We are honored to represent Bangladesh on the international stage.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/india_cover.jpg-YajlS8ILjnMJJMNjPW7QQCXjw0EFox.jpeg",
  },
  {
    title: "Gold Medals Total 68",
    description:
      "The Bangladesh Open Karate Club Championship 2025 saw Victory Bangladesh Wadokai Karate-Do achieve significant success, securing the championship trophy in the boys' division and the runner-up trophy in the girls' division. This marks a strong start to their 2025 tournament season. Congratulations to all the students who performed exceptionally and earned gold medals. Appreciation is also extended to the organizers for hosting the event.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/open_cover.jpg-KtCcUUxHvi5JFsdvSxdNVVHo74Cpta.jpeg",
  },
  {
    title: "Bangladesh Wadokai Karate-do Triumphs at Winter Karate Championship 2024",
    description:
      "We are thrilled to announce that Bangladesh Wadokai Karate-do has emerged as the Winter Karate Championship 2024 champions! Our team secured an impressive medal haul: Gold: 14, Silver: 8, Bronze: 8, Total: 30 medals.  we have concluded the year on a high note with this championship win. Throughout 2024, we participated in numerous national and international tournaments, achieving remarkable success. Out of all the competitions we entered, we secured championship titles in the vast majority, except for four tournaments where we finished as runners-up. These runner-up positions included two tournaments in Bangladesh and two in India. This outstanding performance reflects our karatekas' hard work, dedication, and talent. ",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/winter_cover.jpg-J4EFWgsI0b2PVjBVUvc306RUBJYIA6.jpeg",
  },
  {
    title: "Bangladesh Wadokai Karate-do added another feather to its cap",
    description:
      "On a day commemorating the nation's victory, Bangladesh Wadokai Karate-do added another feather to its cap. The team's dominant performance at the Savar Pappu Raj Shotokan Karate Competition 2024 secured the championship trophy and yielded an impressive medal haul of 12 Gold, 7 Silver, and 2 Bronze. This victory is a fitting tribute to the spirit of courage and determination that defines the nation's history and the team's ethos.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papu_cover.jpg-OtgfmU1udODkQSfmTmPkfaeasc3Um9.jpeg",
  },
  {
    title: "Our team clinched the championship title3",
    description:
      "Alhamdulillah! We are thrilled to announce our unprecedented success at the first Open Gendaria Martial Arts Championship 2024. Our team clinched the championship title by securing an impressive haul of 107 medals, including 42 gold, 35 silver, and 30 bronze.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gandari_cover.jpg-2CudSIBTKMkDFAboMeqHGvANQDnlyA.jpeg",
  },
]

export default function Achievements() {
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
            Our Achievements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Celebrating the success of BWKD students on national and international stages
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
              >
                <div className="relative w-full md:w-1/2 h-64">
                  <Image
                    src={achievement.image || "/placeholder.svg"}
                    alt={achievement.title}
                    layout="fill"
                    objectFit="cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>
                <div className="p-4 sm:p-6 md:w-1/2">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {achievement.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

