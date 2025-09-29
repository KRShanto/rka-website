"use server";

import { prisma } from "@/lib/db";

export async function getAchievements() {
  const achievements = await prisma.achievement.findMany({
    orderBy: {
      date: "desc",
    },
  });
  return achievements;
}

export async function getBranches() {
  const branches = await prisma.branch.findMany();
  return branches;
}

export async function getBlackBelts() {
  const blackBelts = await prisma.user.findMany({
    where: {
      currentBelt: "black-belt",
    },
    orderBy: {
      currentDan: "desc",
    },
  });
  return blackBelts;
}

export async function getBlackBeltById(id: string) {
  const blackBelt = await prisma.user.findUnique({
    where: { id },
    include: {
      branch: true,
    },
  });
  return blackBelt;
}

export async function getGallery() {
  const gallery = await prisma.gallery.findMany();
  return gallery;
}

export async function getNotices() {
  const notices = await prisma.notice.findMany();
  return notices;
}

export async function getTrainers() {
  const trainers = await prisma.user.findMany({
    where: {
      role: "TRAINER",
    },
    orderBy: {
      currentDan: "desc",
    },
  });
  return trainers;
}
