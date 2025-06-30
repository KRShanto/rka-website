"use client";
import Image from "next/image";
import { Award, Calendar, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { PROFILES_TABLE, BRANCHES_TABLE } from "@/lib/supabase-constants";

interface BlackBelt {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image_url: string;
  current_belt: string;
  current_dan: number;
  weight: number;
  gender: string;
  branch: number | null;
  created_at: string;
  dan_exam_dates: string[];
}

interface Branch {
  id: number;
  name: string;
}

export default function BlackBelts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [blackBelts, setBlackBelts] = useState<BlackBelt[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Fetch branches for name lookup
  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from(BRANCHES_TABLE)
        .select("id, name");

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  // Fetch black belts from database
  const fetchBlackBelts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(PROFILES_TABLE)
        .select("*")
        .eq("current_belt", "black-belt")
        .order("current_dan", { ascending: false });

      if (error) throw error;
      setBlackBelts(data || []);
    } catch (error) {
      console.error("Error fetching black belts:", error);
      setBlackBelts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlackBelts();
    fetchBranches();
  }, []);

  // Generate user ID for display
  const generateUserId = (id: number) => {
    return `BWKD${String(id).padStart(3, "0")}`;
  };

  // Get branch name by ID
  const getBranchName = (branchId: number | null) => {
    if (branchId === null) return "Main Dojo";
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Main Dojo";
  };

  // Format dan for display
  const formatDan = (dan: number) => {
    const suffix =
      dan === 1 ? "st" : dan === 2 ? "nd" : dan === 3 ? "rd" : "th";
    return `${dan}${suffix} Dan`;
  };

  // Format date for black belt award (using created_at for now)
  const formatBlackBeltDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter black belts based on search query
  const filteredBlackBelts = blackBelts.filter((blackBelt) => {
    const query = searchQuery.toLowerCase();
    const userId = generateUserId(blackBelt.id);
    return (
      blackBelt.name.toLowerCase().includes(query) ||
      userId.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            BWKD Black Belts
          </h1>
          <p className="text-xl">
            Honoring our dedicated practitioners who have achieved the rank of
            Black Belt
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search by name or ID (e.g., BWKD001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlackBelts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No black belts found matching your search.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try a different name or ID.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBlackBelts.map((blackBelt, index) => {
                const userId = generateUserId(blackBelt.id);
                return (
                  <Link
                    href={`/black-belts/${userId}`}
                    key={blackBelt.id}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
                  >
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={
                          blackBelt.profile_image_url ||
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg"
                        }
                        alt={blackBelt.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < 6 ? "eager" : "lazy"}
                        priority={index < 3}
                      />
                      <div className="absolute top-0 right-0 m-4 bg-[#dc2626]/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {formatDan(blackBelt.current_dan)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white hover:text-primary transition-colors">
                        {blackBelt.name}
                      </h2>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                        <User className="w-3 h-3 mr-2 text-[#dc2626]" />
                        <span className="text-sm">ID: {userId}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                        <Award className="w-3 h-3 mr-2 text-[#dc2626]" />
                        <span className="text-sm">
                          {formatDan(blackBelt.current_dan)} Black Belt
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="w-3 h-3 mr-2 text-[#dc2626]" />
                        <span className="text-sm">
                          Awarded: {formatBlackBeltDate(blackBelt.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
