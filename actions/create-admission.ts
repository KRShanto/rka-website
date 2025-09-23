"use server";

import { prisma } from "@/lib/db";

export type CreateAdmissionInput = {
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string; // ISO string (yyyy-mm-dd)
  bloodGroup?:
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "O_POS"
    | "O_NEG"
    | "AB_POS"
    | "AB_NEG";
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  imageUrl?: string | null;
};

export type CreateAdmissionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Creates a new admission entry for a prospective student.
 * - Expects already-uploaded image URL (if any).
 * - Performs minimal validation; extend as needed.
 */
export async function createAdmission(
  input: CreateAdmissionInput
): Promise<CreateAdmissionResult> {
  try {
    // Basic guards
    if (!input.name?.trim()) return { ok: false, error: "Name is required" };
    if (!input.fatherName?.trim())
      return { ok: false, error: "Father's name is required" };
    if (!input.motherName?.trim())
      return { ok: false, error: "Mother's name is required" };
    if (!input.email?.trim()) return { ok: false, error: "Email is required" };
    if (!input.phone?.trim()) return { ok: false, error: "Phone is required" };
    if (!input.gender) return { ok: false, error: "Gender is required" };
    if (!input.dateOfBirth) return { ok: false, error: "DOB is required" };

    const dob = new Date(input.dateOfBirth);
    if (Number.isNaN(dob.getTime()))
      return { ok: false, error: "Invalid date of birth" };

    const admission = await prisma.admission.create({
      data: {
        name: input.name.trim(),
        fatherName: input.fatherName.trim(),
        motherName: input.motherName.trim(),
        dateOfBirth: dob,
        bloodGroup: input.bloodGroup ?? undefined,
        email: input.email.trim(),
        phone: input.phone.trim(),
        gender: input.gender,
        imageUrl: input.imageUrl ?? undefined,
        status: "PENDING",
      },
      select: { id: true },
    });

    return { ok: true, id: admission.id };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create admission";
    return { ok: false, error: message };
  }
}
