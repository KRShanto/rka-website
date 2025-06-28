"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, supabase } from "@/lib/supabase";
import { PROFILES_TABLE } from "@/lib/supabase-constants";

export async function deleteUser(userId: number, authId: string) {
  try {
    // Validate required fields
    if (!userId || !authId) {
      return {
        success: false,
        error: "User ID and Auth ID are required",
      };
    }

    const supabaseAdmin = getSupabaseAdmin();

    // First, delete from profiles table
    const { error: profileError } = await supabase
      .from(PROFILES_TABLE)
      .delete()
      .eq("id", userId);

    if (profileError) {
      return {
        success: false,
        error: profileError.message,
      };
    }

    // Then, delete from Supabase Auth using admin API
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      authId
    );

    if (authError) {
      console.error("Auth deletion error:", authError);
      // Note: We continue even if auth deletion fails, since profile is already deleted
      // This prevents orphaned profiles if auth deletion fails
    }

    // Revalidate the admin users page to update the UI
    revalidatePath("/admin/users");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message || "Failed to delete user",
    };
  }
}
