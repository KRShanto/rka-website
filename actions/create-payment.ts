"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Prisma, PaymentStatus, PaymentType } from "@prisma/client";

export type CreatePaymentInput = {
  // UI-level values coming from the form
  type: "monthly" | "exam" | "registration" | "event";
  amount: number | string; // accepts string input from <input type="number" />
  bkashTransactionId: string;
};

export type CreatePaymentResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Creates a Payment row for the authenticated user.
 * - Validates input and maps UI strings to Prisma enums
 * - Uses current user id from custom auth (JWT cookie)
 * - Saves amount as Decimal(10,2)
 * - Sets status to PENDING by default; backoffice can confirm/reject later
 */
export async function createPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  // Step 1: Authentication — ensure user is logged in and fetch their id
  const user = await requireAuth();

  // Step 2: Synchronous validation of payload
  const fieldErrors: Record<string, string> = {};

  const normalizedType = mapUiTypeToPrismaType(input.type);
  if (!normalizedType) {
    fieldErrors.type = "Invalid payment type";
  }

  const parsedAmount = parseAmountToTwoDecimalString(input.amount);
  if (!parsedAmount) {
    fieldErrors.amount = "Amount must be a positive number";
  }

  const txId = input.bkashTransactionId?.trim();
  if (!txId) {
    fieldErrors.bkashTransactionId = "Transaction ID is required";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Invalid input", fieldErrors };
  }

  try {
    // Step 3: Create payment
    const payment = await prisma.payment.create({
      data: {
        type: normalizedType!,
        amount: new Prisma.Decimal(parsedAmount!),
        bkashTransactionId: txId!,
        status: PaymentStatus.PENDING,
        userId: user.id,
      },
      select: { id: true },
    });

    return { ok: true, id: payment.id };
  } catch (error: unknown) {
    // Handle unique constraint on bkashTransactionId
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      return {
        ok: false,
        error: "Duplicate transaction ID",
        fieldErrors: {
          bkashTransactionId: "This transaction ID is already used",
        },
      };
    }

    const message =
      error instanceof Error ? error.message : "Failed to create payment";
    return { ok: false, error: message };
  }
}

/**
 * Maps UI dropdown values to Prisma PaymentType enum.
 */
function mapUiTypeToPrismaType(
  value: CreatePaymentInput["type"]
): PaymentType | null {
  switch (value) {
    case "monthly":
      return PaymentType.MONTHLY_FEE;
    case "exam":
      return PaymentType.EXAM_FEE;
    case "registration":
      return PaymentType.REGISTRATION_FEE;
    case "event":
      return PaymentType.EVENT_FEE;
    default:
      return null;
  }
}

/**
 * Parses an input amount (string or number) and returns a string fixed to two decimals.
 * Returns null for invalid/negative/zero amounts.
 */
function parseAmountToTwoDecimalString(value: string | number): string | null {
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num) || num <= 0) return null;
  return num.toFixed(2);
}
