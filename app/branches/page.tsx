"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Phone } from "lucide-react";

interface Branch {
  name: string;
  address: string;
  contactNumber: string;
  schedule: { days: string; times: string[] }[];
  facilities: string[];
}

const branches: Branch[] = [
  // {
  //   name: "Banasree (C Block)",
  //   address: "House 36, Road 3, C Block, Banasree, Dhaka",
  //   contactNumber: "+880 1712-345678",
  //   schedule: [
  //     {
  //       days: "Saturday to Tuesday",
  //       times: [
  //         "7:00 AM - 8:30 AM",
  //         "3:30 PM - 5:00 PM",
  //         "5:30 PM - 7:00 PM",
  //         "7:30 PM - 9:00 PM",
  //       ],
  //     },
  //     {
  //       days: "Wednesday to Friday",
  //       times: [
  //         "7:00 AM - 8:30 AM",
  //         "3:30 PM - 5:00 PM",
  //         "5:30 PM - 7:00 PM",
  //         "7:30 PM - 9:00 PM",
  //       ],
  //     },
  //   ],
  //   facilities: [
  //     "Modern training facility",
  //     "Spacious training area",
  //     "Changing rooms",
  //     "CCTV",
  //     "Viewing area for spectators",
  //   ],
  // },
  // {
  //   name: "Aftabnagar",
  //   address: "Aftabnagar, Dhaka",
  //   contactNumber: "+880 1812-345678",
  //   schedule: [
  //     {
  //       days: "Saturday to Tuesday",
  //       times: [
  //         "7:00 AM - 8:30 AM",
  //         "3:30 PM - 5:00 PM",
  //         "5:30 PM - 7:00 PM",
  //         "7:30 PM - 9:00 PM",
  //       ],
  //     },
  //     {
  //       days: "Wednesday to Friday",
  //       times: [
  //         "7:00 AM - 8:30 AM",
  //         "3:30 PM - 5:00 PM",
  //         "5:30 PM - 7:00 PM",
  //         "7:30 PM - 9:00 PM",
  //       ],
  //     },
  //   ],
  //   facilities: [
  //     "Modern training facility",
  //     "Spacious training area",
  //     "Changing rooms",
  //     "CCTV",
  //     "Viewing area for spectators",
  //   ],
  // },
  // {
  //   name: "Banasree (B Block)",
  //   address: "House 14, Road 5, B Block, Banasree, Dhaka",
  //   contactNumber: "+880 1912-345678",
  //   schedule: [
  //     { days: " Wednesday to  saterday", times: ["5:00 PM - 6:30 PM"] },
  //   ],
  //   facilities: [
  //     "Spacious training area",
  //     "Changing rooms",
  //     "Viewing area for spectators",
  //   ],
  // },
  // {
  //   name: "Rampura TV Center",
  //   address: "TV Center, Rampura, Dhaka",
  //   contactNumber: "+880 1612-345678",
  //   schedule: [
  //     { days: " Saturday  to turshday", times: ["5:30 PM - 7:00 PM"] },
  //   ],
  //   facilities: [
  //     "Spacious training area",
  //     "Changing rooms",
  //     "Viewing area for spectators",
  //   ],
  // },
  // {
  //   name: "NSC Tower",
  //   address: "NSC Tower, Dhaka",
  //   contactNumber: "+880 1512-345678",
  //   schedule: [{ days: "Sunday to turshday", times: ["7:30 AM - 9:00 AM"] }],
  //   facilities: [
  //     "Spacious training area",
  //     "Changing rooms",
  //     "Viewing area for spectators",
  //   ],
  // },
  // {
  //   name: "Demra",
  //   address: "Demra, Dhaka",
  //   contactNumber: "+880 1312-345678",
  //   schedule: [
  //     {
  //       days: "Saturday to Tuesday",
  //       times: [
  //         "7:00 AM - 8:30 AM",
  //         "3:30 PM - 5:00 PM",
  //         "5:30 PM - 7:00 PM",
  //         "7:30 PM - 9:00 PM",
  //       ],
  //     },
  //     {
  //       days: "Wednesday to Friday",
  //       times: [
  //         "7:00 AM - 8:30 AM",
  //         "3:30 PM - 5:00 PM",
  //         "5:30 PM - 7:00 PM",
  //         "7:30 PM - 9:00 PM",
  //       ],
  //     },
  //   ],
  //   facilities: [
  //     "Spacious training area",
  //     "Changing rooms",
  //     "Viewing area for spectator",
  //   ],
  // },
];

export default function Branches() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

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
            Our Branches
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Find a RKA dojo near you and start your karate journey today
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedBranch(branch)}
              >
                <div className="relative h-48">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg"
                    alt={branch.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {branch.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {branch.address}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    Click for more details
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedBranch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setSelectedBranch(null)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-8 max-w-2xl w-full my-4 mx-4 sm:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedBranch.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">
              {selectedBranch.address}
            </p>
            <div className="flex items-center mb-4 text-sm sm:text-base">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              <a
                href={`tel:${selectedBranch.contactNumber.replace(/\s+/g, "")}`}
                className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {selectedBranch.contactNumber}
              </a>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Training Schedule:
            </h3>
            <ul className="mb-4 space-y-2">
              {selectedBranch.schedule.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm sm:text-base"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.days}:
                  </span>
                  <ul className="list-disc list-inside ml-2 sm:ml-4 text-gray-600 dark:text-gray-300">
                    {item.times.map((time, timeIndex) => (
                      <li key={timeIndex}>{time}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Facilities:
            </h3>
            <ul className="mb-4 list-disc list-inside text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {selectedBranch.facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
            <button
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors duration-300 w-full sm:w-auto"
              onClick={() => setSelectedBranch(null)}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
