"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export type SettingsProfileInput = {
  name: string;
  email: string;
  phone: string;
  motherName: string;
  fatherName: string;
  imageUrl?: string | null;
  currentBelt: string;
  currentDan: number;
  danExamDates: string[];
  weight: number;
  gender: "MALE" | "FEMALE";
  branchId: string | null;
};

export type SettingsProfile = {
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

/**
 * Returns the current authenticated user's profile for Settings page.
 * Includes fields from `User` and the selected branchId.
 */
export async function getSettingsProfile(): Promise<SettingsProfile> {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      motherName: true,
      fatherName: true,
      imageUrl: true,
      currentBelt: true,
      currentDan: true,
      danExamDates: true,
      weight: true,
      gender: true,
      branchId: true,
    },
  });

  if (!dbUser) {
    // requireAuth would have redirected, but keep type safety
    throw new Error("User not found");
  }

  return dbUser as SettingsProfile;
}

/**
 * Updates the current authenticated user's profile with validated inputs.
 * Minimal validation; client should pre-validate as well.
 */
export async function updateSettingsProfile(
  input: SettingsProfileInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAuth();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        motherName: input.motherName || null,
        fatherName: input.fatherName || null,
        imageUrl: input.imageUrl ?? undefined,
        currentBelt: input.currentBelt || null,
        currentDan: input.currentDan || null,
        danExamDates: input.danExamDates ?? [],
        weight: input.weight || null,
        gender: input.gender,
        branchId: input.branchId,
      },
    });

    return { ok: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return { ok: false, error: message };
  }
}

/**
 * Changes password for the authenticated user.
 * - Verifies current password hash
 * - Hashes and updates to new password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAuth();

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!dbUser?.password) {
      return { ok: false, error: "Account password not set" };
    }

    const isValid = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isValid) {
      return { ok: false, error: "Current password is incorrect" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { ok: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to change password";
    return { ok: false, error: message };
  }
}
