"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { PaymentStatus, PaymentType } from "@prisma/client";

export type AdminPayment = {
  id: string;
  created_at: string; // ISO
  type: "monthly" | "exam" | "registration" | "event";
  amount: number;
  student_id: string; // username
  bkash_transaction_id: string | null;
  status: "pending" | "confirmed" | "rejected";
  user_id: string;
  profiles: {
    id: string;
    name: string;
    email: string | null;
    profile_image_url: string | null;
  };
};

export async function adminListPayments(): Promise<AdminPayment[]> {
  await requireAuth();
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      type: true,
      amount: true,
      bkashTransactionId: true,
      status: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          imageUrl: true,
        },
      },
    },
  });

  return payments.map((p) => ({
    id: p.id,
    created_at: p.createdAt.toISOString(),
    type: mapPrismaTypeToUi(p.type),
    amount: Number(p.amount),
    student_id: p.user?.username || p.userId,
    bkash_transaction_id: p.bkashTransactionId ?? null,
    status: mapPrismaStatusToUi(p.status),
    user_id: p.userId,
    profiles: {
      id: p.user?.id || p.userId,
      name: p.user?.name || "Unknown",
      email: p.user?.email || null,
      profile_image_url: p.user?.imageUrl || null,
    },
  }));
}

export async function adminConfirmPayment(id: string) {
  await requireAuth();
  await prisma.payment.update({
    where: { id },
    data: { status: PaymentStatus.CONFIRMED },
  });
  return { success: true as const };
}

export async function adminDeletePayment(id: string) {
  await requireAuth();
  await prisma.payment.delete({ where: { id } });
  return { success: true as const };
}

function mapPrismaTypeToUi(type: PaymentType): AdminPayment["type"] {
  switch (type) {
    case PaymentType.MONTHLY_FEE:
      return "monthly";
    case PaymentType.EXAM_FEE:
      return "exam";
    case PaymentType.REGISTRATION_FEE:
      return "registration";
    case PaymentType.EVENT_FEE:
      return "event";
    default:
      return "monthly";
  }
}

function mapPrismaStatusToUi(status: PaymentStatus): AdminPayment["status"] {
  switch (status) {
    case PaymentStatus.PENDING:
      return "pending";
    case PaymentStatus.CONFIRMED:
      return "confirmed";
    case PaymentStatus.REJECTED:
      return "rejected";
    default:
      return "pending";
  }
}
