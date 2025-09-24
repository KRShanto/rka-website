"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Branch } from "@prisma/client";
import { getBranches, getTrainers } from "@/actions/public";

export default function Trainers() {
  const [trainers, setTrainers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // // Fetch branches for name lookup
  // const fetchBranches = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from(BRANCHES_TABLE)
  //       .select("id, name");

  //     if (error) throw error;
  //     setBranches(data || []);
  //   } catch (error) {
  //     console.error("Error fetching branches:", error);
  //   }
  // };

  // // Fetch trainers from database
  // const fetchTrainers = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from(PROFILES_TABLE)
  //       .select("*")
  //       .eq("role", "trainer")
  //       .order("current_dan", { ascending: false });

  //     if (error) throw error;

  //     // Set trainers from database
  //     setTrainers(data || []);
  //   } catch (error) {
  //     console.error("Error fetching trainers:", error);
  //     // Set empty array on error
  //     setTrainers([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  async function fetchTrainersAndBranches() {
    try {
      const trainers = await getTrainers();
      const branches = await getBranches();
      setTrainers(trainers);
      setBranches(branches);
    } catch (error) {
      console.error("Error fetching trainers and branches:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrainersAndBranches();
  }, []);

  // Get branch name by ID
  const getBranchName = (branchId: string | null) => {
    if (branchId === null) return null;
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : null;
  };

  // Format belt rank for display
  const formatBeltRank = (belt: string | null, dan: number) => {
    if (belt === null) return null;
    if (belt === "BLACK_BELT") {
      return `${dan}${
        dan === 1 ? "st" : dan === 2 ? "nd" : dan === 3 ? "rd" : "th"
      } Dan Black Belt`;
    }
    return belt.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Our Trainers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl"
          >
            Meet the experienced senseis who will guide you on your karate
            journey
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No trainers available at the moment.
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Check back soon to meet our instructors!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trainers.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden h-full"
                >
                  <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={trainer.imageUrl || "/placeholder-user.png"}
                      alt={trainer.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index < 6 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                      {trainer.name}
                    </h2>
                    <p className="text-primary font-semibold mb-2 text-sm">
                      {formatBeltRank(
                        trainer.currentBelt,
                        trainer.currentDan ?? 0
                      )}
                    </p>
                    {getBranchName(trainer.branchId) && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        {getBranchName(trainer.branchId)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
