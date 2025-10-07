"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { START_YEAR } from "@/lib/consts";

export default function About() {
  const current = new Date().getFullYear();
  const years = current - START_YEAR;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            About Karate and RKA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Discover the rich history and philosophy behind our martial art
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 px-4 mb-8 md:mb-0"
            >
              <h2 className="text-3xl font-bold mb-4 text-primary dark:text-white">
                What is Karate?
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Karate is a martial art developed in the Ryukyu Kingdom
                (modern-day Okinawa, Japan). It primarily involves striking
                techniques, such as punching, kicking, knee strikes, elbow
                strikes and open-hand techniques. The word "karate" means "empty
                hand" in Japanese, emphasizing that it is an unarmed martial
                art.
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Karate is not just about physical techniques, but also about
                mental and spiritual development. It emphasizes discipline,
                respect, and self-control. The ultimate aim of karate practice
                is to improve oneself through training and to contribute
                positively to society.
              </p>
              <h3 className="text-2xl font-semibold mb-2 text-primary dark:text-white">
                Key Aspects of Karate Training:
              </h3>
              <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
                <li>
                  Kihon (basics): Fundamental techniques practiced repeatedly to
                  develop proper form and muscle memory.
                </li>
                <li>
                  Kata (forms): Pre-arranged sequences of techniques that
                  simulate combat against imaginary opponents.
                </li>
                <li>
                  Kumite (sparring): Controlled fighting practice with a partner
                  to apply techniques in a dynamic setting.
                </li>
                <li>
                  Bunkai: The analysis and practical application of kata
                  movements for self-defense situations.
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 px-4"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VVJWRKEx1FvXwEvPDwpmyKOgn5sPkA.png"
                alt="Karate Techniques Illustration"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 px-4 mb-8 md:mb-0"
            >
              <Image
                src="/rka-logo.png"
                alt="RKA Logo"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2 px-4"
            >
              <h2 className="text-3xl font-bold mb-4 text-primary dark:text-white">
                RKA's Journey
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Roni Karate Academy (RKA) started its journey in {START_YEAR}{" "}
                under the leadership of Roni Islam Ripon. With a vision to
                promote the art of Wadokai Karate in Bangladesh, RKA has grown
                from a small dojo in Dhaka to a nationwide organization with
                branches across the country.
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Over the past {years} years, RKA has trained thousands of
                students, many of whom have gone on to compete at national and
                international levels. Our organization has played a crucial role
                in popularizing Karate in Bangladesh and raising the country's
                profile in international Karate competitions.
              </p>
              <h3 className="text-2xl font-semibold mb-2 text-primary dark:text-white">
                RKA's Core Values:
              </h3>
              <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
                <li>Respect for oneself and others</li>
                <li>Continuous self-improvement</li>
                <li>Discipline and dedication</li>
                <li>Contribution to society</li>
                <li>
                  Preservation and promotion of traditional Wadokai Karate
                </li>
              </ul>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                RKA is affiliated with the Bangladesh Karate Federation (BKF)
                and actively participates in regional and international
                tournaments. We are committed to providing high-quality Karate
                instruction while fostering a sense of community and personal
                growth among our students.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
