"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { AdmissionStatus, Gender, BloodGroup } from "@prisma/client";

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
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function adminApproveAdmission(id: string) {
  await requireAuth();
  await prisma.admission.update({
    where: { id },
    data: { status: AdmissionStatus.APPROVED },
  });
  return { success: true as const };
}

export async function adminRejectAdmission(id: string) {
  await requireAuth();
  await prisma.admission.update({
    where: { id },
    data: { status: AdmissionStatus.REJECTED },
  });
  return { success: true as const };
}
