import { getDbUser } from "@/lib/auth";
import AdminClient from "./client";
import { prisma } from "@/lib/db";
import { useState } from "react";
import { Payment, User } from "@prisma/client";

export default async function AdminDashboard() {
  const user = await getDbUser();
  // fetch total students
  const totalStudents = await prisma.user.count({
    where: {
      role: "USER",
    },
  });

  // fetch total trainers
  const totalTrainers = await prisma.user.count({
    where: {
      role: "TRAINER",
    },
  });

  // fetch total payments
  const pendingPayments = await prisma.payment.count({
    where: {
      status: "PENDING",
    },
  });
  const confirmedPayments = await prisma.payment.count({
    where: {
      status: "CONFIRMED",
    },
  });

  // fetch total achievements
  const totalAchievements = await prisma.achievement.count();

  // fetch total notices
  const totalNotices = await prisma.notice.count();

  // fetch total gallery images
  const totalGalleryImages = await prisma.gallery.count();

  // fetch recent payments
  const recentPayments = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      user: true,
    },
  });

  // fetch recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  console.log(recentPayments);

  return (
    <AdminClient
      user={user}
      stats={{
        totalStudents,
        totalTrainers,
        pendingPayments,
        confirmedPayments,
        totalAchievements,
        totalNotices,
        totalGalleryImages,
        // @ts-ignore
        recentPayments: recentPayments.map((payment) => ({
          ...payment,
          amount: Number(payment.amount),
        })),

        recentUsers,
      }}
    />
  );
}
