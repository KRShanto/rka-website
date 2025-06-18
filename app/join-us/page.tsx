"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Trophy,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function JoinUs() {
  const benefits = [
    {
      icon: Users,
      title: "Expert Instruction",
      description: "Learn from experienced senseis",
    },
    {
      icon: Dumbbell,
      title: "Comprehensive Training",
      description: "Master various Karate techniques",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Classes available at convenient times",
    },
    {
      icon: Trophy,
      title: "Competition Opportunities",
      description:
        "Participate in local national and international tournaments",
    },
  ];

  const branches = [
    {
      name: "Bansree (C Block)",
      address: "House 36, Road 3, C Block, Bansree, Dhaka",
    },
    { name: "Aftabnagar", address: "Aftabnagar, Dhaka" },
    {
      name: "Bansree (B Block)",
      address: "House 14, Road 5, B Block, Bansree, Dhaka",
    },
    { name: "Rampura TV Center", address: "TV Center, Rampura, Dhaka" },
    { name: "NSC Tower", address: "NSC Tower, Dhaka" },
    { name: "Demra", address: "Demra, Dhaka" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="bg-[#dc2626] text-white py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            Join BWKD
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl"
          >
            Begin your karate journey with us today
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                Become Part of Our Dojo
              </h2>
              <p className="mb-8 text-lg text-center">
                At BWKD, we welcome students of all ages and skill levels.
                Whether you're a complete beginner or an experienced martial
                artist, our programs are designed to help you grow and excel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <benefit.icon className="h-8 w-8 text-[#dc2626]" />
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Our Branches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {branches.map((branch, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between"
                      >
                        <span className="font-semibold">{branch.name}</span>
                        <span className="text-gray-600">{branch.address}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#dc2626]" />
                    <span>Main Office: :+880 1763531313</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#dc2626]" />
                    <span>Admissions: +880 1234 567891</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#dc2626]" />
                    <span>Email: info@bwkd.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-[#dc2626]" />
                    <span>123 Karate Street, Dhaka, Bangladesh</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    How to Join
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    To join BWKD, we encourage you to visit our dojo or give us
                    a call. Our experienced staff will be happy to provide you
                    with information about our programs, class schedules, and
                    enrollment process.
                  </p>
                  <Button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-2 px-4 rounded">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="bg-white mb-12">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-4">
                  <Link
                    href="https://www.facebook.com/BWKD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Facebook className="w-6 h-6 mr-2" />
                    <span>Facebook</span>
                  </Link>
                  <Link
                    href="https://www.youtube.com/BWKD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <Youtube className="w-6 h-6 mr-2" />
                    <span>YouTube</span>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
