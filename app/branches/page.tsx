"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Phone, MapPin, Calendar, Building } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { getBranches } from "@/actions/public";

interface Branch {
  name: string;
  address: string;
  contactNumber: string;
  schedule: { days: string; times: string[] }[];
  facilities: string[];
}

export default function Branches() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const rows = await getBranches();
      const mapped: Branch[] = (rows || []).map((b: any) => ({
        name: b.name,
        address: b.address || "",
        contactNumber: b.contactNumber || "",
        // Map schedule stored as [{day,start,end}] to display shape
        schedule: Array.isArray(b.schedule)
          ? Object.values(
              (b.schedule as any[]).reduce((acc: any, cur: any) => {
                const key = cur.day || "";
                const startFmt = cur.start
                  ? moment(cur.start, ["HH:mm", "H:mm", "h:mm A"]).format(
                      "h:mm A"
                    )
                  : "";
                const endFmt = cur.end
                  ? moment(cur.end, ["HH:mm", "H:mm", "h:mm A"]).format(
                      "h:mm A"
                    )
                  : "";
                const time =
                  startFmt && endFmt ? `${startFmt} - ${endFmt}` : "";
                if (!key) return acc;
                if (!acc[key]) acc[key] = { days: key, times: [] as string[] };
                if (time) acc[key].times.push(time);
                return acc;
              }, {})
            )
          : [],
        facilities: (b.facilities as string[] | null) || [],
      }));
      setBranches(mapped);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No branches yet
              </h3>
              <p className="text-gray-500">Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch, index) => (
                <motion.div
                  key={`${branch.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedBranch(branch)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {branch.name}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />{" "}
                        {branch.address || "Address not set"}
                      </div>
                    </div>
                  </div>

                  {branch.schedule.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                        <Calendar className="w-4 h-4" /> Schedule
                      </div>
                      <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                        {branch.schedule.slice(0, 2).map((s, i) => (
                          <li key={i} className="flex justify-between gap-2">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {s.days}
                            </span>
                            <span className="truncate">
                              {s.times.join(", ")}
                            </span>
                          </li>
                        ))}
                        {branch.schedule.length > 2 && (
                          <li className="text-xs text-gray-500">
                            + {branch.schedule.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {branch.facilities && branch.facilities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {branch.facilities.slice(0, 5).map((f, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                          {f}
                        </span>
                      ))}
                      {branch.facilities.length > 5 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                          +{branch.facilities.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 text-sm">
                    {branch.contactNumber && (
                      <a
                        href={`tel:${branch.contactNumber.replace(/\s+/g, "")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Phone className="w-4 h-4" /> {branch.contactNumber}
                      </a>
                    )}
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Tap to view details</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
