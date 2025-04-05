// Appwrite database, collection, and storage IDs
// These would be your actual IDs in production

// User profile database and collection
export const USER_DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_DATABASE_ID || "user_profiles";
export const USER_PROFILES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_PROFILES_COLLECTION_ID || "profiles";

// Storage buckets
export const PROFILE_IMAGES_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILE_IMAGES_BUCKET_ID || "profile_images";
