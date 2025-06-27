"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase, type Profile } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PROFILES_TABLE,
  PROFILE_IMAGES_BUCKET,
  getUserIdFromEmail,
} from "@/lib/supabase-constants";
import ImageCropper from "@/components/ImageCropper";

export type UserProfile = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  mother_name: string;
  father_name: string;
  profile_image_url: string;
  current_belt: string;
  current_dan: number;
  dan_exam_dates: string[];
  weight: number;
  gender: string;
  branch: string;
  auth_id: string;
  role: "student" | "trainer";
  is_admin: boolean;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // User profile data
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    mother_name: "",
    father_name: "",
    profile_image_url: "",
    current_belt: "white",
    current_dan: 1,
    dan_exam_dates: [],
    weight: 0,
    gender: "male",
    branch: "Main Branch",
    auth_id: "",
    role: "student",
    is_admin: false,
  });

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user profile data from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.isLoggedIn) return;

      try {
        setProfileLoading(true);

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
          // Update the profile state with the retrieved data
          setProfile({
            id: profileData.id,
            name: profileData.name || "",
            email: profileData.email || user.email,
            phone: profileData.phone || "",
            mother_name: profileData.mother_name || "",
            father_name: profileData.father_name || "",
            profile_image_url: profileData.profile_image_url || "",
            current_belt: profileData.current_belt || "white",
            current_dan: profileData.current_dan || 1,
            dan_exam_dates: profileData.dan_exam_dates || [],
            weight: profileData.weight || 0,
            gender: profileData.gender || "male",
            branch: profileData.branch || "Main Branch",
            auth_id: authUser.id,
            role: profileData.role || "student",
            is_admin: profileData.is_admin || false,
          });

          // Set image preview if profile image exists
          if (profileData.profile_image_url) {
            setImagePreview(profileData.profile_image_url);
          }
        } else {
          // If profile doesn't exist, create default values
          console.log("No profile found, using defaults");
          setProfile({
            name: user.name || "",
            email: user.email,
            phone: "",
            mother_name: "",
            father_name: "",
            profile_image_url: "",
            current_belt: "white",
            current_dan: 1,
            dan_exam_dates: [],
            weight: 0,
            gender: "male",
            branch: "Main Branch",
            auth_id: authUser.id,
            role: "student",
            is_admin: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle file selection for profile image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG or PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Create a preview URL for cropping
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle cropped image result
  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile);

    // Create preview URL for the cropped image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(croppedFile);

    setCropperOpen(false);
    setImageToCrop(null);
  };

  // Handle cropper close
  const handleCropperClose = () => {
    setCropperOpen(false);
    setImageToCrop(null);
    // Reset file input
    const fileInput = document.getElementById(
      "profileImage"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Upload profile image to Supabase storage
  const uploadProfileImage = async (): Promise<string> => {
    if (!imageFile || !user?.isLoggedIn) return profile.profile_image_url;

    try {
      setImageUploading(true);

      // Get current user from Supabase auth
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return profile.profile_image_url;

      // Create a unique file path combining user ID and timestamp
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `${authUser.id}_${Date.now()}.${fileExtension}`;
      const filePath = `${authUser.id}/${fileName}`;

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from(PROFILE_IMAGES_BUCKET)
        .upload(filePath, imageFile);

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(filePath);

      setImageUploading(false);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      setImageUploading(false);
      return profile.profile_image_url;
    }
  };

  // Handle form submission to save profile data
  const handleSaveProfile = async () => {
    if (!user?.isLoggedIn) return;

    try {
      setLoading(true);

      // Get current user from Supabase auth
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      // Upload image if a new one was selected
      let profileImageUrl = profile.profile_image_url;
      if (imageFile) {
        profileImageUrl = await uploadProfileImage();
      }

      // Prepare profile data
      const profileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        mother_name: profile.mother_name,
        father_name: profile.father_name,
        profile_image_url: profileImageUrl,
        current_belt: profile.current_belt,
        current_dan: profile.current_dan,
        dan_exam_dates: profile.dan_exam_dates,
        weight: profile.weight,
        gender: profile.gender,
        branch: profile.branch,
        auth_id: authUser.id,
        role: profile.role,
        is_admin: profile.is_admin,
      };

      if (profile.id) {
        // Profile exists, update it
        const { error } = await supabase
          .from(PROFILES_TABLE)
          .update(profileData)
          .eq("id", profile.id);

        if (error) throw error;
      } else {
        // Profile doesn't exist, create a new one
        const { data, error } = await supabase
          .from(PROFILES_TABLE)
          .insert([profileData])
          .select()
          .single();

        if (error) throw error;

        // Update profile state with the new ID
        setProfile({
          ...profile,
          id: data.id,
          profile_image_url: profileImageUrl,
        });
      }

      // Update profile state with new image URL if changed
      if (profileImageUrl !== profile.profile_image_url) {
        setProfile((prev) => ({
          ...prev,
          profile_image_url: profileImageUrl,
        }));
      }

      // Clear file input after successful upload
      setImageFile(null);

      // Show success toast notification
      toast.success("Profile updated successfully", {
        description: "Your profile information has been saved.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description:
          "There was an error saving your profile information. Please try again.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError(null);

    if (!user?.isLoggedIn) return;

    // Validate password inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      // Update password using Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Show success toast
      toast.success("Password updated successfully", {
        description: "Your password has been changed.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError(
        "Failed to update password. Please check your current password."
      );
      toast.error("Failed to update password", {
        description:
          "There was an error changing your password. Please verify your current password.",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for profile fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select input changes for profile fields
  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => {
      const updated = { ...prev, [name]: value };

      // If changing current belt, reset dan-related fields
      if (name === "current_belt" && value !== "black-belt") {
        updated.current_dan = 1;
        updated.dan_exam_dates = [];
      }

      // If changing current dan, update dan_exam_dates array length
      if (name === "current_dan") {
        const danLevel = parseInt(value);
        const currentDates = prev.dan_exam_dates || [];
        const newDates = Array(danLevel)
          .fill("")
          .map((_, index) => currentDates[index] || "");
        updated.dan_exam_dates = newDates;
      }

      return updated;
    });
  };

  // Handle dan exam date changes
  const handleDanDateChange = (index: number, value: string) => {
    setProfile((prev) => {
      const currentDates = prev.dan_exam_dates || [];
      const newDates = [...currentDates];
      newDates[index] = value;
      return { ...prev, dan_exam_dates: newDates };
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile image */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {imagePreview || profile.profile_image_url ? (
                        <AvatarImage
                          src={imagePreview || profile.profile_image_url}
                          alt={profile.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {profile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {imageUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="profileImage">Profile Picture</Label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG or PNG. Max size 5MB.
                    </p>
                  </div>
                </div>

                {/* Name field */}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email and phone */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Parent names */}
                <div>
                  <Label htmlFor="father_name">Father's Name</Label>
                  <Input
                    id="father_name"
                    name="father_name"
                    value={profile.father_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="mother_name">Mother's Name</Label>
                  <Input
                    id="mother_name"
                    name="mother_name"
                    value={profile.mother_name}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Mobile Save Button for Personal Information */}
                <div className="lg:hidden pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading || profileLoading}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Karate Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Karate Information</CardTitle>
              <CardDescription>
                Your current martial arts details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="current_belt">Current Belt</Label>
                  <Select
                    value={profile.current_belt}
                    onValueChange={(value) =>
                      handleSelectChange("current_belt", value)
                    }
                  >
                    <SelectTrigger id="current_belt">
                      <SelectValue placeholder="Select your current belt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="green-junior">Green Junior</SelectItem>
                      <SelectItem value="green-senior">Green Senior</SelectItem>
                      <SelectItem value="blue-junior">Blue Junior</SelectItem>
                      <SelectItem value="blue-senior">Blue Senior</SelectItem>
                      <SelectItem value="brown-junior">Brown Junior</SelectItem>
                      <SelectItem value="brown-senior">Brown Senior</SelectItem>
                      <SelectItem value="black-belt">Black Belt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Dan selection - only show for black belt */}
                {profile.current_belt === "black-belt" && (
                  <div>
                    <Label htmlFor="current_dan">Current Dan</Label>
                    <Select
                      value={profile.current_dan.toString()}
                      onValueChange={(value) =>
                        handleSelectChange("current_dan", value)
                      }
                    >
                      <SelectTrigger id="current_dan">
                        <SelectValue placeholder="Select your current dan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Dan</SelectItem>
                        <SelectItem value="2">2nd Dan</SelectItem>
                        <SelectItem value="3">3rd Dan</SelectItem>
                        <SelectItem value="4">4th Dan</SelectItem>
                        <SelectItem value="5">5th Dan</SelectItem>
                        <SelectItem value="6">6th Dan</SelectItem>
                        <SelectItem value="7">7th Dan</SelectItem>
                        <SelectItem value="8">8th Dan</SelectItem>
                        <SelectItem value="9">9th Dan</SelectItem>
                        <SelectItem value="10">10th Dan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Dan exam dates - only show for black belt */}
                {profile.current_belt === "black-belt" &&
                  profile.current_dan && (
                    <div>
                      <Label>Dan Exam Dates</Label>
                      <div className="space-y-3 mt-2">
                        {Array.from(
                          { length: profile.current_dan },
                          (_, index) => (
                            <div key={index}>
                              <Label
                                htmlFor={`danDate${index + 1}`}
                                className="text-sm"
                              >
                                {index + 1}
                                {index === 0
                                  ? "st"
                                  : index === 1
                                  ? "nd"
                                  : index === 2
                                  ? "rd"
                                  : "th"}{" "}
                                Dan Exam Date
                              </Label>
                              <Input
                                id={`danDate${index + 1}`}
                                type="date"
                                value={profile.dan_exam_dates[index] || ""}
                                onChange={(e) =>
                                  handleDanDateChange(index, e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        weight: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup
                    value={profile.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={profile.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {profile.role === "trainer" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_admin"
                      checked={profile.is_admin}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          is_admin: e.target.checked,
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="is_admin">Administrator privileges</Label>
                  </div>
                )}

                {/* Mobile Save Button for Karate Information */}
                <div className="lg:hidden pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading || profileLoading}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}

                <Button
                  onClick={handlePasswordChange}
                  disabled={
                    loading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="mt-2"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Save Profile Section */}
          <Card className="hidden lg:block fixed top-32 left-[calc(66.666667%+2rem)] w-80 z-10 shadow-lg">
            <CardHeader>
              <CardTitle>Save Changes</CardTitle>
              <CardDescription>Apply your profile updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click the button below to save all changes to your profile
                  information.
                </p>
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading || profileLoading}
                  className="w-full"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          open={cropperOpen}
          onClose={handleCropperClose}
          onCropComplete={handleCropComplete}
          aspectRatio={1} // 1:1 for square
        />
      )}
    </div>
  );
}
