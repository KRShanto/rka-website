"use client";
import Image from "next/image";
import { Award, Calendar, Search, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Branch, User } from "@prisma/client";
import { getBlackBelts, getBranches } from "@/actions/public";

export default function BlackBelts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [blackBelts, setBlackBelts] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

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

  // // Fetch black belts from database
  // const fetchBlackBelts = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from(PROFILES_TABLE)
  //       .select("*")
  //       .eq("current_belt", "black-belt")
  //       .order("current_dan", { ascending: false });

  //     if (error) throw error;
  //     setBlackBelts(data || []);
  //   } catch (error) {
  //     console.error("Error fetching black belts:", error);
  //     setBlackBelts([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  async function getBlackBeltsWithBranches() {
    try {
      setLoading(true);
      const blackBelts = await getBlackBelts();
      const branches = await getBranches();
      setBlackBelts(blackBelts);
      setBranches(branches);
    } catch (error) {
      console.error("Error fetching black belts with branches:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBlackBeltsWithBranches();
  }, []);

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
    return (
      blackBelt.name.toLowerCase().includes(query) ||
      blackBelt.id.toString().includes(query)
    );
  });

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            RKA Black Belts
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
                placeholder="Search by name or ID"
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
              {filteredBlackBelts.map((blackBelt, index) => (
                <Link
                  href={`/black-belts/${blackBelt.id}`}
                  key={blackBelt.id}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={blackBelt.imageUrl || "/placeholder-user.png"}
                      alt={blackBelt.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index < 6 ? "eager" : "lazy"}
                      priority={index < 3}
                    />
                    <div className="absolute top-0 right-0 m-4 bg-[#dc2626]/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {formatDan(blackBelt.currentDan ?? 0)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white hover:text-primary transition-colors">
                      {blackBelt.name}
                    </h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <UserIcon className="w-3 h-3 mr-2 text-[#dc2626]" />
                      <span className="text-sm">ID: {blackBelt.id}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <Award className="w-3 h-3 mr-2 text-[#dc2626]" />
                      <span className="text-sm">
                        {formatDan(blackBelt.currentDan ?? 0)} Black Belt
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="w-3 h-3 mr-2 text-[#dc2626]" />
                      <span className="text-sm">
                        Awarded:{" "}
                        {formatBlackBeltDate(blackBelt.createdAt.toISOString())}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
