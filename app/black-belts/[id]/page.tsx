"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Award, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getProfileById,
  type BlackBeltProfile,
} from "@/lib/data/black-belt-profiles";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to get ordinal suffix
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

export default function BlackBeltProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<BlackBeltProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate async data fetching
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Add a small delay to ensure loading state is shown
        await new Promise((resolve) => setTimeout(resolve, 100));

        const profileData = getProfileById(id);
        if (profileData) {
          setProfile(profileData);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="mb-6">
            The black belt profile you are looking for does not exist.
          </p>
          <Link href="/black-belts">
            <Button>Return to Black Belts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={profile.image || "/placeholder.svg"}
                alt={profile.name}
                layout="fill"
                objectFit="cover"
                priority
                loading="eager"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 dark:text-white">
                {profile.fullName}
              </h1>
              <p className="text-xl mb-2">{profile.dan} Black Belt</p>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Award className="w-5 h-5" />
                <span>BWKD ID: {profile.userId}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
                  Achievements
                </h2>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  {profile.achievements.map((achievement, index) => (
                    <li key={index} className="leading-relaxed">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add a new section for Karate Journey here to make it more prominent */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
                  Karate Journey
                </h2>
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Joined BWKD
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.joinDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <Award className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      Current Rank
                    </p>
                  </div>

                  <div className="ml-8 space-y-4 border-l-2 border-primary/30 pl-4">
                    {/* Generate previous dan ranks based on current rank */}
                    {Array.from(
                      { length: Number.parseInt(profile.dan.split("")[0]) },
                      (_, i) => i + 1
                    ).map((dan) => (
                      <div key={dan} className="relative">
                        <div className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-primary"></div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {dan}
                          {getOrdinalSuffix(dan)} Dan Black Belt
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {/* Calculate approximate dates based on current date and rank */}
                          {new Date(
                            new Date(profile.blackBeltDate).getTime() -
                              (Number.parseInt(profile.dan.split("")[0]) -
                                dan) *
                                3 *
                                365 *
                                24 *
                                60 *
                                60 *
                                1000
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 sticky top-24">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Birthday
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.birthday}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Gender
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.gender}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        BWKD ID
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.userId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/black-belts">
              <Button className="bg-primary hover:bg-primary/90">
                Back to All Black Belts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-background min-h-screen pt-16">
      <section className="bg-primary dark:bg-gray-900 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="w-48 h-48 rounded-full" />
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
}
