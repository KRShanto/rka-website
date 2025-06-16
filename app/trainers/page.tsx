"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const trainers = [
  {
    name: "Sehan Kitamora Tetsuro",
    rank: "7th Dan Black Belt",
    bio: "Sensei Kitamora has been practicing karate for over 30 years and has won numerous international competitions.",
  },
  {
    name: "Abdul Sukkur Ali Shikder",
    rank: "6th Dan Black Belt",
    bio: "Abdul specializes in kata and has represented Bangladesh in the Asian Karate Championships.",
  },
  {
    name: "Sharuk Khan Raj",
    rank: "4th Dan Black Belt",
    bio: "Sharuk is known for his exceptional teaching skills and has trained many national-level competitors.",
  },
  {
    name: "Laima Shikder",
    rank: "4th Dan Black Belt",
    bio: "Laima Shikder is known for her precise technique and has been instrumental in promoting karate among young women in Bangladesh.",
  },
  {
    name: "Maimuna Shikder",
    rank: "3rd Dan Black Belt",
    bio: "Maimuna Shikder specializes in kata performance and has represented BWKD in several national competitions with distinction.",
  },
  {
    name: "TH Tanjim",
    rank: "3rd Dan Black Belt",
    bio: "Tanjim is an expert in Kumite and has coached the national team in multiple international tournaments.",
  },
  {
    name: "Forkan",
    rank: "3rd Dan Black Belt",
    bio: "Forkan focuses on youth development and has implemented successful children's Karate programs.",
  },
  {
    name: "Kanij Fatema Eva",
    rank: "2nd Dan Black Belt",
    bio: "Eva is a pioneer in promoting women's Karate in Bangladesh and has won multiple national titles.",
  },
  {
    name: "SK Mostofa Hasan",
    rank: "2nd Dan Black Belt",
    bio: "Mostofa specializes in combining traditional Karate with modern fitness techniques for holistic training.",
  },
  {
    name: "Mirdul",
    rank: "1st Dan Black Belt",
    bio: "Mirdul excels in teaching Karate philosophy and meditation alongside physical techniques.",
  },
  {
    name: "Ashikur Rahaman",
    rank: "1st Dan Black Belt",
    bio: "Ashikur is dedicated to nurturing young talent and has developed innovative training methods for beginners.",
  },
];

export default function Trainers() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Our Trainers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Meet the experienced senseis who will guide you on your karate
            journey
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <motion.div
                key={trainer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full"
              >
                <div className="relative h-64">
                  <Image
                    src={
                      trainer.name === "Sehan Kitamora Tetsuro"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tetsuro%20Kitamura.jpg-2yGjyvbDVxWOa7gPUROXQ3VRrge59v.jpeg"
                        : trainer.name === "SK Mostofa Hasan"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sk.jpg-p41OviwOQth8DcNq2CdWjq6XBhEQde.jpeg"
                        : trainer.name === "TH Tanjim"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tanjim-pyoBmEdeoAHaxOmndYQkWT6Gc92ETb.jpeg"
                        : trainer.name === "Abdul Sukkur Ali Shikder"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sukkur-CPuPQFW1Y4pZogkeSgjHBsbEPnw5vP.jpeg"
                        : trainer.name === "Sharuk Khan Raj"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/srk-IaKF8bBdIYdep3yGT0Yoz2kwfR7H0a.jpeg"
                        : trainer.name === "Forkan"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/forkan-70IUALFPGyIJTxqM4XVeaKrP08uv2x.jpeg"
                        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg"
                    }
                    alt={trainer.name}
                    layout="fill"
                    objectFit="cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="transition-transform duration-300 hover:scale-110"
                    loading={index < 6 ? "eager" : "lazy"}
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {trainer.name}
                  </h2>
                  <p className="text-primary font-semibold mb-4">
                    {trainer.rank}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {trainer.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
