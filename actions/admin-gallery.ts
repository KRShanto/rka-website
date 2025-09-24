"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export type AdminGalleryItem = {
  id: string;
  url: string;
  created_at: string; // ISO
};

export async function adminListGallery(): Promise<AdminGalleryItem[]> {
  await requireAuth();
  const rows = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, createdAt: true },
  });
  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    created_at: r.createdAt.toISOString(),
  }));
}

export async function adminCreateGalleryItems(urls: string[]) {
  await requireAuth();
  if (!Array.isArray(urls) || urls.length === 0) {
    return { success: false as const, error: "No images to add" };
  }
  const created = await prisma.$transaction(
    urls.map((url) =>
      prisma.gallery.create({
        data: { url },
        select: { id: true, url: true, createdAt: true },
      })
    )
  );
  const items: AdminGalleryItem[] = created.map((r) => ({
    id: r.id,
    url: r.url,
    created_at: r.createdAt.toISOString(),
  }));
  return { success: true as const, items };
}

export async function adminDeleteGalleryItem(id: string) {
  await requireAuth();
  await prisma.gallery.delete({ where: { id } });
  return { success: true as const };
}
