// Supabase table names and configuration
export const PROFILES_TABLE = "profiles";
export const GALLERY_TABLE = "gallery";

// Storage bucket names
export const PROFILE_IMAGES_BUCKET = "profile-images";

// Helper function to get user ID from email (maintaining compatibility)
export const getUserIdFromEmail = (email: string): string => {
  return email.split("@")[0];
};
