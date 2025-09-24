import { useParams } from "next/navigation";
import Image from "next/image";
import { Award, Calendar, User as UserIcon, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Branch } from "@prisma/client";
import { getBlackBeltById } from "@/actions/public";
import { JsonValue } from "@prisma/client/runtime/library";

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

// Format dan for display
const formatDan = (dan: number) => {
  const suffix = dan === 1 ? "st" : dan === 2 ? "nd" : dan === 3 ? "rd" : "th";
  return `${dan}${suffix} Dan`;
};

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlackBeltProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const params = useParams();
  const id = (await params).id as string;
  // const [profile, setProfile] = useState<User | null>(null);
  // const [branches, setBranches] = useState<Branch[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);
  // const [authEmail, setAuthEmail] = useState<string | null>(null);

  // useEffect(() => {
  //   // Fetch branches
  //   const fetchBranches = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from(BRANCHES_TABLE)
  //         .select("id, name");
  //       if (error) throw error;
  //       setBranches(data || []);
  //     } catch (error) {
  //       console.error("Error fetching branches:", error);
  //     }
  //   };

  //   // Fetch profile from database
  //   const fetchProfile = async () => {
  //     try {
  //       setLoading(true);

  //       // Get profile by ID
  //       const { data: profileData, error: profileError } = await supabase
  //         .from(PROFILES_TABLE)
  //         .select("*")
  //         .eq("id", id)
  //         .eq("current_belt", "black-belt")
  //         .single();

  //       if (profileError) {
  //         setError(true);
  //         return;
  //       }

  //       if (!profileData) {
  //         setError(true);
  //         return;
  //       }

  //       setProfile(profileData);

  //       // Get auth email using server action
  //       if (profileData.auth_id) {
  //         const result = await getAuthEmail(profileData.auth_id);
  //         if (result.success && result.email) {
  //           setAuthEmail(result.email);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching profile:", err);
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBranches();
  //   fetchProfile();
  // }, [id]);

  // if (loading) {
  //   return <ProfileSkeleton />;
  // }

  const profile = await getBlackBeltById(id);

  if (!profile) {
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
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={profile.imageUrl || "/placeholder-user.png"}
                alt={profile.name}
                layout="fill"
                objectFit="cover"
                priority
                loading="eager"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 dark:text-white">
                {profile.name}
              </h1>
              <p className="text-xl mb-2">
                {formatDan(profile.currentDan ?? 0)} Black Belt
              </p>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Award className="w-5 h-5" />
                <span>RKAD ID: {profile.username}</span>
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
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <UserIcon className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <UserIcon className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Phone
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {profile.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <UserIcon className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Branch
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.branch?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
                  Dan Progression
                </h2>
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Award className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Current Rank: {formatDan(profile.currentDan ?? 0)} Black
                        Belt
                      </p>
                    </div>
                  </div>

                  {profile.danExamDates &&
                    Array.isArray(profile.danExamDates) &&
                    profile.danExamDates.length > 0 && (
                      <div className="ml-8 space-y-4 border-l-2 border-primary/30 pl-4">
                        {profile.danExamDates.map(
                          (date: JsonValue | null, index: number) => (
                            <div key={index} className="relative">
                              <div className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-primary"></div>
                              <p className="font-medium text-gray-700 dark:text-gray-300">
                                {index + 1}
                                {getOrdinalSuffix(index + 1)} Dan Black Belt
                              </p>
                              {date && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  {formatDate(date.toString())}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
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
                    <UserIcon className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Member Since
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDate(profile.createdAt.toISOString())}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <UserIcon className="w-5 h-5 mt-0.5 text-[#dc2626]" />
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
                        RKA ID
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.username}
                      </p>
                    </div>
                  </div>

                  {profile.weight && profile.weight > 0 && (
                    <div className="flex items-start gap-3">
                      <UserIcon className="w-5 h-5 mt-0.5 text-[#dc2626]" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Weight
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {profile.weight} kg
                        </p>
                      </div>
                    </div>
                  )}
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
