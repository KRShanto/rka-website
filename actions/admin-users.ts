"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Role, Gender } from "@prisma/client";
import bcrypt from "bcryptjs";

export type AdminUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  mother_name: string | null;
  father_name: string | null;
  profile_image_url: string | null;
  current_belt: string | null;
  current_dan: number | null;
  weight: number | null;
  gender: "male" | "female" | null;
  branch: string | null; // branchId
  role: "student" | "trainer";
  is_admin: boolean;
  created_at: string;
};

function mapRoleToUi(role: Role): {
  role: "student" | "trainer";
  is_admin: boolean;
} {
  if (role === Role.ADMIN) return { role: "student", is_admin: true };
  if (role === Role.TRAINER) return { role: "trainer", is_admin: false };
  return { role: "student", is_admin: false };
}

function mapUiToRole(role: "student" | "trainer", is_admin: boolean): Role {
  if (is_admin) return Role.ADMIN;
  return role === "trainer" ? Role.TRAINER : Role.USER;
}

export async function adminListUsers(): Promise<AdminUser[]> {
  await requireAuth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      motherName: true,
      fatherName: true,
      imageUrl: true,
      currentBelt: true,
      currentDan: true,
      weight: true,
      gender: true,
      branchId: true,
      role: true,
      createdAt: true,
    },
  });

  return users.map((u) => {
    const { role, is_admin } = mapRoleToUi(u.role);
    return {
      id: u.id,
      name: u.name,
      email: u.email ?? null,
      phone: u.phone ?? null,
      mother_name: u.motherName ?? null,
      father_name: u.fatherName ?? null,
      profile_image_url: u.imageUrl ?? null,
      current_belt: u.currentBelt ?? null,
      current_dan: u.currentDan ?? null,
      weight: u.weight ?? null,
      gender: u.gender ? (u.gender === Gender.MALE ? "male" : "female") : null,
      branch: u.branchId ?? null,
      role,
      is_admin,
      created_at: u.createdAt.toISOString(),
    };
  });
}

export type AdminCreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  mother_name?: string;
  father_name?: string;
  profile_image_url?: string;
  current_belt?: string;
  current_dan?: number;
  weight?: number;
  gender: "male" | "female";
  branch?: string | null;
  role: "student" | "trainer";
  is_admin?: boolean;
};

export async function adminCreateUser(input: AdminCreateUserInput) {
  await requireAuth();
  const hashed = await bcrypt.hash(input.password, 10);
  const dbUser = await prisma.user.create({
    data: {
      name: input.name,
      username: input.email.split("@")[0],
      email: input.email,
      password: hashed,
      phone: input.phone ?? null,
      motherName: input.mother_name ?? null,
      fatherName: input.father_name ?? null,
      imageUrl: input.profile_image_url ?? null,
      currentBelt: input.current_belt ?? null,
      currentDan: input.current_dan ?? null,
      weight: input.weight ?? null,
      gender: input.gender === "female" ? Gender.FEMALE : Gender.MALE,
      branchId: input.branch ?? null,
      role: mapUiToRole(input.role, Boolean(input.is_admin)),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      motherName: true,
      fatherName: true,
      imageUrl: true,
      currentBelt: true,
      currentDan: true,
      weight: true,
      gender: true,
      branchId: true,
      role: true,
      createdAt: true,
    },
  });

  const { role, is_admin } = mapRoleToUi(dbUser.role);
  const user: AdminUser = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email ?? null,
    phone: dbUser.phone ?? null,
    mother_name: dbUser.motherName ?? null,
    father_name: dbUser.fatherName ?? null,
    profile_image_url: dbUser.imageUrl ?? null,
    current_belt: dbUser.currentBelt ?? null,
    current_dan: dbUser.currentDan ?? null,
    weight: dbUser.weight ?? null,
    gender: dbUser.gender
      ? dbUser.gender === Gender.MALE
        ? "male"
        : "female"
      : null,
    branch: dbUser.branchId ?? null,
    role,
    is_admin,
    created_at: dbUser.createdAt.toISOString(),
  };

  return { success: true as const, user };
}

export type AdminUpdateUserInput = {
  id: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  mother_name?: string | null;
  father_name?: string | null;
  profile_image_url?: string | null;
  current_belt?: string | null;
  current_dan?: number | null;
  weight?: number | null;
  gender?: "male" | "female" | null;
  branch?: string | null;
  role?: "student" | "trainer";
  is_admin?: boolean;
};

export async function adminUpdateUser(input: AdminUpdateUserInput) {
  await requireAuth();
  await prisma.user.update({
    where: { id: input.id },
    data: {
      name: input.name ?? undefined,
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
      motherName: input.mother_name ?? undefined,
      fatherName: input.father_name ?? undefined,
      imageUrl: input.profile_image_url ?? undefined,
      currentBelt: input.current_belt ?? undefined,
      currentDan: input.current_dan ?? undefined,
      weight: input.weight ?? undefined,
      gender: input.gender
        ? input.gender === "female"
          ? Gender.FEMALE
          : Gender.MALE
        : undefined,
      branchId: input.branch ?? undefined,
      role:
        input.role !== undefined || input.is_admin !== undefined
          ? mapUiToRole(input.role ?? "student", Boolean(input.is_admin))
          : undefined,
    },
  });

  return { success: true as const };
}

export async function adminDeleteUser(id: string) {
  await requireAuth();
  await prisma.user.delete({ where: { id } });
  return { success: true as const };
}
