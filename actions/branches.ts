"use server";

import { prisma } from "@/lib/db";

export type BranchOption = { id: string; name: string };

export async function listBranches(): Promise<BranchOption[]> {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return branches;
}
