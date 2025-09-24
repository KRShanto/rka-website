"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export type AdminBranch = {
  id: string;
  name: string;
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
    created_at: b.createdAt.toISOString(),
    user_count: branchIdToCount.get(b.id) ?? 0,
  }));
}

export async function adminCreateBranch(name: string) {
  await requireAuth();
  if (!name.trim())
    return { success: false as const, error: "Name is required" };
  const b = await prisma.branch.create({ data: { name: name.trim() } });
  return {
    success: true as const,
    branch: {
      id: b.id,
      name: b.name,
      created_at: b.createdAt.toISOString(),
      user_count: 0,
    },
  };
}

export async function adminUpdateBranch(id: string, name: string) {
  await requireAuth();
  if (!name.trim())
    return { success: false as const, error: "Name is required" };
  await prisma.branch.update({ where: { id }, data: { name: name.trim() } });
  return { success: true as const };
}

export async function adminDeleteBranch(id: string) {
  await requireAuth();
  await prisma.branch.delete({ where: { id } });
  return { success: true as const };
}
