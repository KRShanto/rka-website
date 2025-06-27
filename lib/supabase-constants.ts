// Supabase table names and configuration
export const PROFILES_TABLE = "profiles";
export const GALLERY_TABLE = "gallery";
export const BRANCHES_TABLE = "branches";
export const NOTICES_TABLE = "notices";

// Storage bucket names
export const PROFILE_IMAGES_BUCKET = "profile-images";

// Helper function to get user ID from email (maintaining compatibility)
export const getUserIdFromEmail = (email: string): string => {
  return email.split("@")[0];
};
