"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { AdmissionStatus, Gender, BloodGroup, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export type AdminAdmission = {
  id: string;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string; // ISO
  bloodGroup: keyof typeof BloodGroup | null;
  email: string;
  phone: string;
  gender: keyof typeof Gender;
  imageUrl: string | null;
  bkashTransactionId: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string; // ISO
};

export async function adminListAdmissions(): Promise<AdminAdmission[]> {
  await requireAuth();
  const rows = await prisma.admission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    fatherName: r.fatherName,
    motherName: r.motherName,
    dateOfBirth: r.dateOfBirth.toISOString(),
    bloodGroup: (r.bloodGroup as any) ?? null,
    email: r.email,
    phone: r.phone,
    gender: r.gender as any,
    imageUrl: r.imageUrl ?? null,
    bkashTransactionId: r.bkashTransactionId ?? null,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * Generates the next username in the format d101, d102, d103, etc.
 * Searches for the highest existing formatted username and returns the next one.
 * Skips custom usernames like "shanto" and only considers d-prefixed numeric usernames.
 *
 * @returns Promise<string> - The next username in the sequence (e.g., "d101", "d102")
 */
export async function generateNextUsername(): Promise<string> {
  // Query all usernames that match the pattern d + number (d101, d102, etc.)
  // We use a regex pattern to find usernames that start with 'd' followed by digits
  const users = await prisma.user.findMany({
    where: {
      username: {
        // Match usernames that start with 'd' followed by digits
        startsWith: "d",
      },
    },
    select: {
      username: true,
    },
  });

  // Filter and extract numeric parts from formatted usernames only
  const formattedUsernames = users
    .map((user) => user.username)
    .filter((username) => /^d\d+$/.test(username)) // Only d followed by digits
    .map((username) => parseInt(username.substring(1))) // Extract the number part
    .filter((num) => !isNaN(num)); // Ensure it's a valid number

  // Find the highest number
  let highestNumber = 100; // Start from 100 (so first user will be d101)

  if (formattedUsernames.length > 0) {
    highestNumber = Math.max(...formattedUsernames);
  }

  // Generate the next username
  const nextNumber = highestNumber + 1;
  console.log("Next username:", `d${nextNumber}`);
  return `d${nextNumber}`;
}

export async function adminApproveAdmission(id: string) {
  await requireAuth();

  // Get the admission details first
  const admission = await prisma.admission.findUnique({
    where: { id },
  });

  if (!admission) {
    throw new Error("Admission not found");
  }
  // Generate the next username
  const username = await generateNextUsername();

  // Generate a default password (you can customize this logic)
  const defaultPassword = process.env.DEFAULT_USER_PASSWORD;
  if (!defaultPassword) {
    throw new Error("Default password not found in environment variables");
  }

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // Use a transaction to ensure both operations succeed or fail together
  await prisma.$transaction(async (tx) => {
    // Approve the admission
    await tx.admission.update({
      where: { id },
      data: { status: AdmissionStatus.APPROVED },
    });

    // Create the user with admission data
    await tx.user.create({
      data: {
        name: admission.name,
        username: username,
        password: hashedPassword,
        email: admission.email,
        phone: admission.phone,
        motherName: admission.motherName,
        fatherName: admission.fatherName,
        imageUrl: admission.imageUrl,
        gender: admission.gender,
        joinDate: new Date(), // Set join date to current date
        role: Role.STUDENT, // Default role for new users
        // Note: branchId can be set later by admin if needed
      },
    });
  });

  return {
    success: true as const,
    username,
    defaultPassword, // Return for admin to inform the new user
  };
}

export async function adminRejectAdmission(id: string) {
  await requireAuth();
  await prisma.admission.update({
    where: { id },
    data: { status: AdmissionStatus.REJECTED },
  });
  return { success: true as const };
}
