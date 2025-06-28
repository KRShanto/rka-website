"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, supabase } from "@/lib/supabase";
import { PROFILES_TABLE } from "@/lib/supabase-constants";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  mother_name?: string;
  father_name?: string;
  profile_image_url?: string;
  current_belt?: string;
  current_dan?: number;
  weight?: number;
  gender?: string;
  branch?: number | null;
  role?: "student" | "trainer";
  is_admin?: boolean;
}

export async function createUser(userData: CreateUserData) {
  try {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return {
        success: false,
        error: "Name, email, and password are required",
      };
    }

    // Format email for auth
    const authEmail = userData.email.includes("@")
      ? userData.email
      : `${userData.email}@bwkd.app`;

    // Create auth user using admin API
    const supabaseAdmin = getSupabaseAdmin();
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: authEmail,
        password: userData.password,
        email_confirm: true,
      });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    // Create profile
    const profileData = {
      name: userData.name,
      email: authEmail,
      phone: userData.phone || "",
      mother_name: userData.mother_name || "",
      father_name: userData.father_name || "",
      profile_image_url: userData.profile_image_url || "",
      current_belt: userData.current_belt || "white",
      current_dan: userData.current_dan || 1,
      weight: userData.weight || 0,
      gender: userData.gender || "male",
      branch: userData.branch || null,
      auth_id: authData.user.id,
      role: userData.role || "student",
      is_admin: userData.is_admin || false,
    };

    const { data: profileResponse, error: profileError } = await supabase
      .from(PROFILES_TABLE)
      .insert([profileData])
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        error: profileError.message,
      };
    }

    // Revalidate the admin users page to show the new user
    revalidatePath("/admin/users");

    return {
      success: true,
      user: {
        ...profileResponse,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error.message || "Failed to create user",
    };
  }
}
