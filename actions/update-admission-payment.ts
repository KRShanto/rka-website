"use server";

import { prisma } from "@/lib/db";

export type UpdateAdmissionPaymentInput = {
  admissionId: string;
  bkashTransactionId: string;
};

export type UpdateAdmissionPaymentResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/**
 * Updates an admission record with bkash transaction ID.
 */
export async function updateAdmissionPayment(
  input: UpdateAdmissionPaymentInput
): Promise<UpdateAdmissionPaymentResult> {
  try {
    // Basic guards
    if (!input.admissionId?.trim())
      return { ok: false, error: "Admission ID is required" };
    if (!input.bkashTransactionId?.trim())
      return { ok: false, error: "Bkash Transaction ID is required" };

    // Check if admission exists
    const existingAdmission = await prisma.admission.findUnique({
      where: { id: input.admissionId },
    });

    if (!existingAdmission) {
      return { ok: false, error: "Admission not found" };
    }

    // Update the admission with bkash transaction ID
    const admission = await prisma.admission.update({
      where: { id: input.admissionId },
      data: {
        bkashTransactionId: input.bkashTransactionId.trim(),
      },
      select: { id: true },
    });

    return { ok: true, id: admission.id };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update admission payment";
    return { ok: false, error: message };
  }
}
