"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function getAuthEmail(auth_id: string): Promise<{
  success: boolean;
  email?: string;
  error?: string;
}> {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Get specific user by ID directly
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(auth_id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user || !data.user.email) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      email: data.user.email,
    };
  } catch (error: any) {
    console.error("Error fetching auth email:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch auth email",
    };
  }
}
