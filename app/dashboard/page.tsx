"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { PROFILES_TABLE } from "@/lib/supabase-constants";
import { toast } from "sonner";

// Define user profile type
type UserProfile = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  mother_name: string;
  father_name: string;
  profile_image_url: string;
  current_belt: string;
  weight: number;
  gender: string;
  branch?: number | null;
  branch_name?: string;
  join_date?: string;
  auth_id: string;
  role?: "student" | "trainer";
  is_admin?: boolean;
};

export default function IDPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Generate a student ID based on auth ID
  const generateStudentId = (authId: string) => {
    // Use the current year and the auth ID to create a formatted ID
    const year = new Date().getFullYear();
    // Take the first 4 characters of the authId or pad with zeros
    const idSuffix = authId.slice(0, 4).padEnd(4, "0");
    return `BWKD-${year}-${idSuffix}`;
  };

  // Format belt name for display
  const formatBeltName = (beltColor: string): string => {
    if (!beltColor) return "White";
    return beltColor.charAt(0).toUpperCase() + beltColor.slice(1);
  };

  // Fetch profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.isLoggedIn) return;

      try {
        setLoading(true);

        // Get current user from Supabase auth
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) return;

        // Try to get the user profile from Supabase
        const { data: profileData, error } = await supabase
          .from(PROFILES_TABLE)
          .select("*")
          .eq("auth_id", authUser.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" error
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data");
          return;
        }

        if (profileData) {
          // Fetch branch name if branch ID exists
          let branchName = "No Branch Assigned";
          if (profileData.branch) {
            try {
              const { data: branchData, error: branchError } = await supabase
                .from("branches")
                .select("name")
                .eq("id", profileData.branch)
                .single();

              if (!branchError && branchData) {
                branchName = branchData.name;
              }
            } catch (error) {
              console.error("Error fetching branch name:", error);
            }
          }

          // Set the profile data
          setProfile({
            id: profileData.id,
            name: profileData.name || "",
            email: profileData.email || user.email,
            phone: profileData.phone || "",
            mother_name: profileData.mother_name || "",
            father_name: profileData.father_name || "",
            profile_image_url: profileData.profile_image_url || "",
            current_belt: profileData.current_belt || "white",
            weight: profileData.weight || 0,
            gender: profileData.gender || "male",
            branch: profileData.branch || null,
            branch_name: branchName,
            join_date:
              profileData.join_date || new Date().toISOString().split("T")[0],
            auth_id: authUser.id,
            role: profileData.role || "student",
            is_admin: profileData.is_admin || false,
          });
        } else {
          // If document doesn't exist, use defaults
          console.log("Creating default profile for ID card");
          const defaultProfile = {
            name: user.name || "",
            email: user.email,
            phone: "",
            mother_name: "",
            father_name: "",
            profile_image_url: "",
            current_belt: "white",
            weight: 0,
            gender: "male",
            branch: null,
            branch_name: "No Branch Assigned",
            join_date: new Date().toISOString().split("T")[0],
            auth_id: authUser.id,
            role: "student" as const,
            is_admin: false,
          };
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download an ID card
    toast.info("ID card download functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format joined date for display
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "January 1, 2023";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "January 1, 2023";
    }
  };

  // Calculate expiration date (3 years from join date)
  const calculateExpiryDate = (joinDateString?: string) => {
    if (!joinDateString) return "December 31, 2025";

    try {
      const joinDate = new Date(joinDateString);
      const expiryDate = new Date(joinDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      return expiryDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "December 31, 2025";
    }
  };

  const studentId = generateStudentId(profile?.auth_id || "default");
  const joinDate = formatJoinDate(profile?.join_date);
  const expiryDate = calculateExpiryDate(profile?.join_date);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ID Card Management</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Student ID Card</CardTitle>
            <CardDescription>
              View and print your student ID card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 print:shadow-none">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-white w-full py-2 text-center rounded-t-lg">
                  <h3 className="font-bold">Bangladesh Wadokai Karate Do</h3>
                </div>
                <div className="relative w-24 h-24 mt-4 mb-2 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src={profile?.profile_image_url || "/placeholder.svg"}
                    alt={`${profile?.name || "Student"} Photo`}
                    width={96}
                    height={96}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-lg">{profile?.name}</h3>
                <p className="text-gray-600 text-sm">Student ID: {studentId}</p>
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Belt:</span>
                    <span className="text-sm">
                      {formatBeltName(profile?.current_belt || "")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Branch:</span>
                    <span className="text-sm">
                      {profile?.branch_name || "No Branch Assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Joined:</span>
                    <span className="text-sm">{joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Valid Until:</span>
                    <span className="text-sm">{expiryDate}</span>
                  </div>
                </div>
                <div className="mt-4 w-full border-t border-gray-200 pt-4 text-center">
                  <p className="text-xs text-gray-500">
                    This card is the property of BWKD and must be returned upon
                    request.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print ID Card
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
