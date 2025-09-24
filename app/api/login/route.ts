import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/jwt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session data
    const sessionData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    // Sign JWT - now properly awaited
    const token = await signJWT(sessionData);

    // Create the response
    const response = NextResponse.json({
      user: sessionData,
    });

    // Set cookie with proper options
    (await cookies()).set(process.env.JWT_COOKIE_NAME || "token", token, {
      httpOnly: true,
      // TODO: Uncomment this when we use a domain for production
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 15, // 15 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
