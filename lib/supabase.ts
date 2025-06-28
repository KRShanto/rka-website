import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types based on your schema
export type Profile = {
  id: number;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  mother_name: string | null;
  father_name: string | null;
  profile_image_url: string | null;
  current_belt: string | null;
  current_dan: number | null;
  dan_exam_dates: any[] | null;
  weight: number | null;
  gender: string | null;
  branch: string | null;
  join_date: string | null;
  auth_id: string | null;
  role: "student" | "trainer" | null;
  is_admin: boolean | null;
};

export type ProfileInsert = Omit<Profile, "id" | "created_at">;
export type ProfileUpdate = Partial<ProfileInsert>;
