"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export type AdminBranch = {
  id: string;
  name: string;
  address?: string | null;
  contactNumber?: string | null;
  schedule?: any[] | null;
  facilities?: string[] | null;
  created_at: string;
  user_count: number;
};

export async function adminListBranches(): Promise<AdminBranch[]> {
  await requireAuth();
  const [branches, counts] = await Promise.all([
    prisma.branch.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.groupBy({ by: ["branchId"], _count: { branchId: true } }),
  ]);

  const branchIdToCount = new Map<string, number>();
  counts.forEach((c) => {
    if (c.branchId) branchIdToCount.set(c.branchId, c._count.branchId);
  });

  return branches.map((b) => ({
    id: b.id,
    name: b.name,
    address: (b as any).address ?? null,
    contactNumber: (b as any).contactNumber ?? null,
    schedule: (b as any).schedule ?? null,
    facilities: (b as any).facilities ?? null,
    created_at: b.createdAt.toISOString(),
    user_count: branchIdToCount.get(b.id) ?? 0,
  }));
}

export async function adminCreateBranch(
  name: string,
  opts?: {
    address?: string;
    contactNumber?: string;
    schedule?: any[]; // e.g., { day, start, end }
    facilities?: string[];
  }
) {
  await requireAuth();
  if (!name.trim())
    return { success: false as const, error: "Name is required" };
  const b = await prisma.branch.create({
    data: {
      name: name.trim(),
      address: opts?.address?.trim() || undefined,
      contactNumber: opts?.contactNumber?.trim() || undefined,
      schedule: opts?.schedule ? (opts.schedule as any) : undefined,
      facilities: opts?.facilities ? (opts.facilities as any) : undefined,
    },
  });
  return {
    success: true as const,
    branch: {
      id: b.id,
      name: b.name,
      address: (b as any).address ?? null,
      contactNumber: (b as any).contactNumber ?? null,
      schedule: (b as any).schedule ?? null,
      facilities: (b as any).facilities ?? null,
      created_at: b.createdAt.toISOString(),
      user_count: 0,
    },
  };
}

export async function adminUpdateBranch(
  id: string,
  name: string,
  opts?: {
    address?: string | null;
    contactNumber?: string | null;
    schedule?: any[] | null; // e.g., { day, start, end }
    facilities?: string[] | null;
  }
) {
  await requireAuth();
  if (!name.trim())
    return { success: false as const, error: "Name is required" };
  await prisma.branch.update({
    where: { id },
    data: {
      name: name.trim(),
      address: opts?.address ?? undefined,
      contactNumber: opts?.contactNumber ?? undefined,
      schedule:
        opts?.schedule === undefined ? undefined : (opts?.schedule as any),
      facilities:
        opts?.facilities === undefined ? undefined : (opts?.facilities as any),
    },
  });
  return { success: true as const };
}

export async function adminDeleteBranch(id: string) {
  await requireAuth();
  await prisma.branch.delete({ where: { id } });
  return { success: true as const };
}
