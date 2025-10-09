"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Role, Gender } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateNextUsername } from "./admin-admissions";

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  mother_name: string | null;
  father_name: string | null;
  profile_image_url: string | null;
  current_belt: string | null;
  current_dan: number | null;
  weight: number | null;
  gender: Gender | null;
  branch: string | null; // branchId
  role: Role;
  isAdmin: boolean;
  created_at: string;
};

export async function adminListUsers(): Promise<AdminUser[]> {
  await requireAuth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      motherName: true,
      fatherName: true,
      imageUrl: true,
      currentBelt: true,
      currentDan: true,
      weight: true,
      gender: true,
      branchId: true,
      role: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return users.map((u) => {
    return {
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email ?? null,
      phone: u.phone ?? null,
      mother_name: u.motherName ?? null,
      father_name: u.fatherName ?? null,
      profile_image_url: u.imageUrl ?? null,
      current_belt: u.currentBelt ?? null,
      current_dan: u.currentDan ?? null,
      weight: u.weight ?? null,
      gender: u.gender,
      branch: u.branchId ?? null,
      role: u.role,
      isAdmin: u.isAdmin,
      created_at: u.createdAt.toISOString(),
    };
  });
}

/**
 * Gets the next available username for the admin UI
 * This function is called by the frontend to populate the username field
 *
 * @returns Promise<{nextUsername: string}> - The next available username
 */
export async function adminGetNextUsername(): Promise<{
  nextUsername: string;
}> {
  await requireAuth();
  const nextUsername = await generateNextUsername();
  return { nextUsername };
}

/**
 * Validates if a username is available (not already taken)
 *
 * @param username - The username to check
 * @returns Promise<{isAvailable: boolean}> - Whether the username is available
 */
export async function adminCheckUsernameAvailability(
  username: string
): Promise<{ isAvailable: boolean }> {
  await requireAuth();

  const existingUser = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  return { isAvailable: !existingUser };
}

export type AdminCreateUserInput = {
  name: string;
  username: string;
  email?: string;
  password: string;
  phone?: string;
  mother_name?: string;
  father_name?: string;
  profile_image_url?: string;
  current_belt?: string;
  current_dan?: number;
  weight?: number;
  gender: Gender;
  branch?: string | null;
  role: Role;
  isAdmin?: boolean;
};

export async function adminCreateUser(input: AdminCreateUserInput) {
  await requireAuth();

  // Validate username availability
  const { isAvailable } = await adminCheckUsernameAvailability(input.username);
  if (!isAvailable) {
    throw new Error(`Username "${input.username}" is already taken`);
  }

  // Validate username format (optional: only if you want to enforce specific patterns)
  if (input.username.trim().length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  const hashed = await bcrypt.hash(input.password, 10);
  const dbUser = await prisma.user.create({
    data: {
      name: input.name,
      username: input.username.trim(),
      email: input.email ?? null,
      password: hashed,
      phone: input.phone ?? null,
      motherName: input.mother_name ?? null,
      fatherName: input.father_name ?? null,
      imageUrl: input.profile_image_url ?? null,
      currentBelt: input.current_belt ?? null,
      currentDan: input.current_dan ?? null,
      weight: input.weight ?? null,
      gender: input.gender,
      branchId: input.branch ?? null,
      role: input.role,
      isAdmin: input.isAdmin ?? false,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      motherName: true,
      fatherName: true,
      imageUrl: true,
      currentBelt: true,
      currentDan: true,
      weight: true,
      gender: true,
      branchId: true,
      role: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  const user: AdminUser = {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    email: dbUser.email ?? null,
    phone: dbUser.phone ?? null,
    mother_name: dbUser.motherName ?? null,
    father_name: dbUser.fatherName ?? null,
    profile_image_url: dbUser.imageUrl ?? null,
    current_belt: dbUser.currentBelt ?? null,
    current_dan: dbUser.currentDan ?? null,
    weight: dbUser.weight ?? null,
    gender: dbUser.gender,
    branch: dbUser.branchId ?? null,
    role: dbUser.role,
    isAdmin: dbUser.isAdmin,
    created_at: dbUser.createdAt.toISOString(),
  };

  return { success: true as const, user };
}

export type AdminUpdateUserInput = {
  id: string;
  name?: string;
  username?: string;
  email?: string | null;
  phone?: string | null;
  mother_name?: string | null;
  father_name?: string | null;
  profile_image_url?: string | null;
  current_belt?: string | null;
  current_dan?: number | null;
  weight?: number | null;
  gender?: Gender | null;
  branch?: string | null;
  role?: Role;
  isAdmin?: boolean;
};

export async function adminUpdateUser(input: AdminUpdateUserInput) {
  await requireAuth();

  // Validate username if it's being updated
  if (input.username !== undefined) {
    // Check if username format is valid
    if (input.username.trim().length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    // Check if username is available (excluding current user)
    const existingUser = await prisma.user.findUnique({
      where: { username: input.username.trim() },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== input.id) {
      throw new Error(`Username "${input.username}" is already taken`);
    }
  }

  await prisma.user.update({
    where: { id: input.id },
    data: {
      name: input.name ?? undefined,
      username: input.username ? input.username.trim() : undefined,
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
      motherName: input.mother_name ?? undefined,
      fatherName: input.father_name ?? undefined,
      imageUrl: input.profile_image_url ?? undefined,
      currentBelt: input.current_belt ?? undefined,
      currentDan: input.current_dan ?? undefined,
      weight: input.weight ?? undefined,
      gender: input.gender,
      branchId: input.branch ?? undefined,
      role: input.role,
      isAdmin: input.isAdmin ?? false,
    },
  });

  return { success: true as const };
}

export async function adminDeleteUser(id: string) {
  await requireAuth();
  await prisma.user.delete({ where: { id } });
  return { success: true as const };
}
