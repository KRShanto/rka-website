"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, MapPinIcon, BellIcon } from "lucide-react";
import { Notice as NoticeType, Branch } from "@prisma/client";
import { getNotices, getBranches } from "@/actions/public";
import { toast } from "sonner";

export default function Notice() {
  const [notices, setNotices] = useState<NoticeType[]>([]);
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

  // // Fetch notices
  // const fetchNotices = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from(NOTICES_TABLE)
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (error) throw error;
  //     setNotices(data || []);
  //   } catch (error) {
  //     console.error("Error fetching notices:", error);
  //     toast.error("Failed to load notices");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  async function fetchNoticesAndBranches() {
    try {
      const notices = await getNotices();
      const branches = await getBranches();
      setNotices(notices);
      setBranches(branches);
    } catch (error) {
      console.error("Error fetching notices and branches:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNoticesAndBranches();
  }, []);

  // Show all notices regardless of user's branch or authentication status
  const filteredNotices = notices;

  // Get branch name by ID
  const getBranchName = (branchId: string | null) => {
    if (branchId === null) return "All Branches";
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No specific date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-primary text-primary-foreground py-10 mt-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Notices & Events
          </h1>
          <p className="text-xl">
            Stay updated with the latest news and upcoming events at BWKD
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No notices available
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                There are currently no notices to display.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
                        {notice.title}
                      </h2>
                      <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                        <div className="flex items-center text-primary dark:text-primary-foreground">
                          <CalendarIcon className="w-5 h-5 mr-2" />
                          <span className="text-sm">
                            {formatDate(notice.date.toISOString())}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {getBranchName(notice.branchId)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
