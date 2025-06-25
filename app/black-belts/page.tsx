"use client";
import Image from "next/image";
import { Award, Calendar, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { blackBeltsBasic } from "@/lib/data/black-belt-profiles";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlackBelts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Filter black belts based on search query
  const filteredBlackBelts = blackBeltsBasic.filter((blackBelt) => {
    const query = searchQuery.toLowerCase();
    return (
      blackBelt.name.toLowerCase().includes(query) ||
      blackBelt.userId.toLowerCase().includes(query)
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlackBelts.map((blackBelt, index) => (
                <Link
                  href={`/black-belts/${blackBelt.userId}`}
                  key={blackBelt.userId}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={blackBelt.image || "/placeholder.svg"}
                      alt={blackBelt.name}
                      fill
                      className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index < 6 ? "eager" : "lazy"}
                      priority={index < 3}
                    />
                    <div className="absolute top-0 right-0 m-4 bg-[#dc2626]/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {blackBelt.dan}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-primary transition-colors">
                      {blackBelt.name}
                    </h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <User className="w-4 h-4 mr-2 text-[#dc2626]" />
                      <span>ID: {blackBelt.userId}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                      <Award className="w-4 h-4 mr-2 text-[#dc2626]" />
                      <span>{blackBelt.dan} Black Belt</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-[#dc2626]" />
                      <span>Awarded: {blackBelt.date}</span>
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
