import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import { prisma } from "./db";
import { redirect } from "next/navigation";

export type DbUser = NonNullable<Awaited<ReturnType<typeof getDbUser>>>;

export async function getUser() {
  try {
    // Get token from cookies
    const token = (await cookies()).get(
      process.env.JWT_COOKIE_NAME || "token"
    )?.value;

    if (!token) {
      return null;
    }

    // Verify token and get payload
    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        isAdmin: true,
      },
    });

    if (!user) {
      // Do not modify cookies here; just return null
      return null;
    }

    // Transform the data to a more convenient structure
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Type for the returned user object
export type AuthUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

// Helper to use in Server Components to require authentication
export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// Get user from the database
// This is used in Server Components to get the user from the database
// This expects the user to be authenticated, otherwise it will redirect to the login page
export async function getDbUser() {
  const dbUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: dbUser.id },
    select: {
      id: true,
      name: true,
      username: true,
      imageUrl: true,
      email: true,
      role: true,
      phone: true,
      fatherName: true,
      motherName: true,
      gender: true,
      currentBelt: true,
      currentDan: true,
      danExamDates: true,
      weight: true,
      joinDate: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}
