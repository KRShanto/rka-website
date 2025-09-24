"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export type AdminAchievement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string; // ISO
};

export async function adminListAchievements(): Promise<AdminAchievement[]> {
  await requireAuth();
  const rows = await prisma.achievement.findMany({
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      date: true,
    },
  });
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    imageUrl: a.imageUrl ?? null,
    date: a.date.toISOString(),
  }));
}

export async function adminCreateAchievement(input: {
  title: string;
  description: string;
  imageUrl?: string | null;
  date?: string | null; // ISO
}) {
  await requireAuth();
  const title = input.title?.trim();
  const description = input.description?.trim();
  if (!title) return { success: false as const, error: "Title is required" };
  if (!description)
    return { success: false as const, error: "Description is required" };
  const date = input.date ? new Date(input.date) : new Date();
  const row = await prisma.achievement.create({
    data: { title, description, imageUrl: input.imageUrl ?? null, date },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      date: true,
    },
  });
  return {
    success: true as const,
    achievement: {
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.imageUrl ?? null,
      date: row.date.toISOString(),
    } as AdminAchievement,
  };
}

export async function adminUpdateAchievement(
  id: string,
  input: {
    title: string;
    description: string;
    imageUrl?: string | null;
    date?: string | null;
  }
) {
  await requireAuth();
  const title = input.title?.trim();
  const description = input.description?.trim();
  if (!title) return { success: false as const, error: "Title is required" };
  if (!description)
    return { success: false as const, error: "Description is required" };
  const data: {
    title: string;
    description: string;
    imageUrl?: string | null;
    date?: Date;
  } = {
    title,
    description,
  };
  if (typeof input.imageUrl !== "undefined") data.imageUrl = input.imageUrl;
  if (typeof input.date !== "undefined")
    data.date = input.date ? new Date(input.date) : new Date();
  await prisma.achievement.update({ where: { id }, data });
  return { success: true as const };
}

export async function adminDeleteAchievement(id: string) {
  await requireAuth();
  await prisma.achievement.delete({ where: { id } });
  return { success: true as const };
}
