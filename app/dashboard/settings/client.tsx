"use client";

import { useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageCropper from "@/components/ImageCropper";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { changePassword, updateSettingsProfile } from "@/actions/profile";

type Branch = { id: string; name: string };

type ServerProfile = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  motherName: string | null;
  fatherName: string | null;
  imageUrl: string | null;
  currentBelt: string | null;
  currentDan: number | null;
  danExamDates: any | null;
  weight: number | null;
  gender: "MALE" | "FEMALE" | null;
  branchId: string | null;
};

type Props = {
  initialProfile: ServerProfile;
  branches: Branch[];
  auth: { email: string; username: string };
};

export default function SettingsClient({
  initialProfile,
  branches,
  auth,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialProfile.imageUrl || null
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [branchesLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: initialProfile.name || "",
    email: initialProfile.email || auth.email,
    phone: initialProfile.phone || "",
    mother_name: initialProfile.motherName || "",
    father_name: initialProfile.fatherName || "",
    profile_image_url: initialProfile.imageUrl || "",
    current_belt: initialProfile.currentBelt || "white",
    current_dan: initialProfile.currentDan || 1,
    dan_exam_dates:
      (Array.isArray(initialProfile.danExamDates)
        ? initialProfile.danExamDates
        : []) || [],
    weight: initialProfile.weight || 0,
    gender:
      (initialProfile.gender?.toLowerCase() as "male" | "female") || "male",
    branch: initialProfile.branchId
      ? initialProfile.branchId
      : (null as string | null),
  });

  const { uploadFiles } = genUploader<OurFileRouter>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG or PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(croppedFile);
    setCropperOpen(false);
    setImageToCrop(null);
  };

  const handleCropperClose = () => {
    setCropperOpen(false);
    setImageToCrop(null);
    const fileInput = document.getElementById(
      "profileImage"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const uploadProfileImage = async (): Promise<string> => {
    if (!imageFile) return profile.profile_image_url;
    try {
      setImageUploading(true);
      const res = await uploadFiles("imageUploader", { files: [imageFile] });
      const url = res?.[0]?.ufsUrl ?? profile.profile_image_url;
      setImageUploading(false);
      return url;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      setImageUploading(false);
      return profile.profile_image_url;
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      let profileImageUrl = profile.profile_image_url;
      if (imageFile) {
        profileImageUrl = await uploadProfileImage();
      }
      const res = await updateSettingsProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        motherName: profile.mother_name,
        fatherName: profile.father_name,
        imageUrl: profileImageUrl,
        currentBelt: profile.current_belt,
        currentDan: profile.current_dan,
        danExamDates: profile.dan_exam_dates,
        weight: profile.weight,
        gender: profile.gender.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE",
        branchId: profile.branch ? String(profile.branch) : null,
      });
      if (!("ok" in res) || !res.ok) {
        throw new Error((res as any).error || "Failed to update profile");
      }
      if (profileImageUrl !== profile.profile_image_url) {
        setProfile((prev) => ({ ...prev, profile_image_url: profileImageUrl }));
      }
      setImageFile(null);
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

  const handlePasswordChange = async () => {
    setPasswordError(null);
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
      const res = await changePassword(currentPassword, newPassword);
      if (!res.ok) throw new Error(res.error);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully", {
        description: "Your password has been changed.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordError(
        error?.message ||
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => {
      const updated: any = { ...prev };
      if (name === "branch") {
        updated.branch = value === "none" ? null : value;
      } else if (name === "current_dan") {
        updated.current_dan = parseInt(value);
      } else if (name === "current_belt") {
        updated.current_belt = value;
      } else if (name === "gender") {
        updated.gender = value;
      }
      if (name === "current_belt" && value !== "black-belt") {
        updated.current_dan = 1;
        updated.dan_exam_dates = [];
      }
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    type="text"
                    value={auth.username}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is your student ID (cannot be changed)
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Display Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This email is shown in your public profile
                  </p>
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

                <div className="lg:hidden pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Label htmlFor="branch">Branch</Label>
                  <Select
                    value={profile.branch || "none"}
                    onValueChange={(value) =>
                      handleSelectChange("branch", value)
                    }
                    disabled={branchesLoading}
                  >
                    <SelectTrigger id="branch">
                      <SelectValue placeholder={"Select your branch"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Branch</SelectItem>
                      {branches.map((branch, index) => (
                        <SelectItem key={index} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:hidden pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          open={cropperOpen}
          onClose={handleCropperClose}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </div>
  );
}
