"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export type AdminNotice = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  branchId: string;
  created_at: string; // ISO
};

export async function adminListNotices(): Promise<AdminNotice[]> {
  await requireAuth();
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      branchId: true,
      createdAt: true,
    },
  });
  return notices.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    date: n.date.toISOString(),
    branchId: n.branchId,
    created_at: n.createdAt.toISOString(),
  }));
}

export async function adminCreateNotice(input: {
  title: string;
  description: string;
  date?: string | null; // ISO or undefined
  branchId: string;
}) {
  await requireAuth();
  const title = input.title?.trim();
  const description = input.description?.trim();
  const branchId = input.branchId?.trim();
  if (!title) return { success: false as const, error: "Title is required" };
  if (!description)
    return { success: false as const, error: "Description is required" };
  if (!branchId)
    return { success: false as const, error: "Branch is required" };
  const date = input.date ? new Date(input.date) : new Date();
  const n = await prisma.notice.create({
    data: { title, description, date, branchId },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      branchId: true,
      createdAt: true,
    },
  });
  return {
    success: true as const,
    notice: {
      id: n.id,
      title: n.title,
      description: n.description,
      date: n.date.toISOString(),
      branchId: n.branchId,
      created_at: n.createdAt.toISOString(),
    } as AdminNotice,
  };
}

export async function adminUpdateNotice(
  id: string,
  input: {
    title: string;
    description: string;
    date?: string | null;
    branchId: string;
  }
) {
  await requireAuth();
  const title = input.title?.trim();
  const description = input.description?.trim();
  const branchId = input.branchId?.trim();
  if (!title) return { success: false as const, error: "Title is required" };
  if (!description)
    return { success: false as const, error: "Description is required" };
  if (!branchId)
    return { success: false as const, error: "Branch is required" };
  const date = input.date ? new Date(input.date) : new Date();
  await prisma.notice.update({
    where: { id },
    data: { title, description, date, branchId },
  });
  return { success: true as const };
}

export async function adminDeleteNotice(id: string) {
  await requireAuth();
  await prisma.notice.delete({ where: { id } });
  return { success: true as const };
}
