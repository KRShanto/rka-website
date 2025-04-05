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
import { appwrite } from "@/lib/appwrite";
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
  USER_DATABASE_ID,
  USER_PROFILES_COLLECTION_ID,
  PROFILE_IMAGES_BUCKET_ID,
} from "@/lib/appwrite-constants";

export type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  motherName: string;
  fatherName: string;
  profileImageUrl: string;
  currentBelt: string;
  weight: string;
  gender: string;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // User profile data
  const [profile, setProfile] = useState<UserProfile>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    motherName: "",
    fatherName: "",
    profileImageUrl: "",
    currentBelt: "white",
    weight: "",
    gender: "male",
  });

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user profile data from Appwrite
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.isLoggedIn) return;

      try {
        setProfileLoading(true);

        // Get user ID from the authenticated user
        const userId = user.email.split("@")[0];

        try {
          // Try to get the user profile document
          const response = await appwrite.databases.getDocument(
            USER_DATABASE_ID,
            USER_PROFILES_COLLECTION_ID,
            userId
          );

          // Update the profile state with the retrieved data
          setProfile({
            userId: userId,
            firstName: response.firstName || "",
            lastName: response.lastName || "",
            email: response.email || user.email,
            phone: response.phone || "",
            motherName: response.motherName || "",
            fatherName: response.fatherName || "",
            profileImageUrl: response.profileImageUrl || "",
            currentBelt: response.currentBelt || "white",
            weight: response.weight || "",
            gender: response.gender || "male",
          });

          // Set image preview if profile image exists
          if (response.profileImageUrl) {
            setImagePreview(response.profileImageUrl);
          }
        } catch (error) {
          // If document doesn't exist, create a new profile with default values
          console.log("Creating new user profile");
          setProfile({
            userId: userId,
            firstName: user.name.split(" ")[0] || "",
            lastName: user.name.split(" ")[1] || "",
            email: user.email,
            phone: "",
            motherName: "",
            fatherName: "",
            profileImageUrl: "",
            currentBelt: "white",
            weight: "",
            gender: "male",
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

    setImageFile(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload profile image to Appwrite storage
  const uploadProfileImage = async (): Promise<string> => {
    if (!imageFile || !user?.isLoggedIn) return profile.profileImageUrl;

    try {
      setImageUploading(true);

      // Extract user ID from email
      const userId = user.email.split("@")[0];

      // Create a unique file ID combining user ID and timestamp
      const fileId = `${userId}_${Date.now()}`;

      // Upload the file to Appwrite storage
      const response = await appwrite.storage.createFile(
        PROFILE_IMAGES_BUCKET_ID,
        fileId,
        imageFile
      );

      // Get file view URL - returns a URL string
      const fileUrl = appwrite.storage.getFileView(
        PROFILE_IMAGES_BUCKET_ID,
        response.$id
      );

      setImageUploading(false);
      return fileUrl.toString();
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
      setImageUploading(false);
      return profile.profileImageUrl;
    }
  };

  // Handle form submission to save profile data
  const handleSaveProfile = async () => {
    if (!user?.isLoggedIn) return;

    try {
      setLoading(true);

      // Extract user ID from email
      const userId = user.email.split("@")[0];

      // Upload image if a new one was selected
      let profileImageUrl = profile.profileImageUrl;
      if (imageFile) {
        profileImageUrl = await uploadProfileImage();
      }

      // Prepare profile data
      const profileData = {
        ...profile,
        profileImageUrl,
        userId,
      };

      try {
        // Try to get the document to see if it exists
        await appwrite.databases.getDocument(
          USER_DATABASE_ID,
          USER_PROFILES_COLLECTION_ID,
          userId
        );

        // Document exists, update it
        await appwrite.databases.updateDocument(
          USER_DATABASE_ID,
          USER_PROFILES_COLLECTION_ID,
          userId,
          profileData
        );
      } catch (error) {
        // Document doesn't exist, create a new one
        await appwrite.databases.createDocument(
          USER_DATABASE_ID,
          USER_PROFILES_COLLECTION_ID,
          userId,
          profileData
        );
      }

      // Update profile state with new data
      setProfile({
        ...profile,
        profileImageUrl,
      });

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

      // Get the user's email
      const email = user.email;

      // First create a session using the current password to verify it's correct
      await appwrite.account.createEmailPasswordSession(email, currentPassword);

      // Then update the password
      await appwrite.account.updatePassword(newPassword, currentPassword);

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
    setProfile((prev) => ({ ...prev, [name]: value }));
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
                      {imagePreview || profile.profileImageUrl ? (
                        <AvatarImage
                          src={imagePreview || profile.profileImageUrl}
                          alt={profile.firstName}
                        />
                      ) : (
                        <AvatarFallback>
                          {profile.firstName.charAt(0)}
                          {profile.lastName.charAt(0)}
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

                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
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
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={profile.fatherName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    value={profile.motherName}
                    onChange={handleInputChange}
                  />
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
                  <Label htmlFor="currentBelt">Current Belt</Label>
                  <Select
                    value={profile.currentBelt}
                    onValueChange={(value) =>
                      handleSelectChange("currentBelt", value)
                    }
                  >
                    <SelectTrigger id="currentBelt">
                      <SelectValue placeholder="Select your current belt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White Belt</SelectItem>
                      <SelectItem value="yellow">Yellow Belt</SelectItem>
                      <SelectItem value="orange">Orange Belt</SelectItem>
                      <SelectItem value="green">Green Belt</SelectItem>
                      <SelectItem value="blue">Blue Belt</SelectItem>
                      <SelectItem value="purple">Purple Belt</SelectItem>
                      <SelectItem value="brown">Brown Belt</SelectItem>
                      <SelectItem value="black">Black Belt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={profile.weight}
                    onChange={handleInputChange}
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
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
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
          <Card>
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
    </div>
  );
}
