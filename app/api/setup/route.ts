import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

interface SetupRequest {
  name: string;
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    // Check setup token for security
    const setupToken = request.headers.get("X-TOKEN");

    if (!setupToken || setupToken !== process.env.SETUP_TOKEN) {
      return NextResponse.json(
        { error: "Invalid or missing setup token" },
        { status: 401 }
      );
    }

    const { name, username, password }: SetupRequest = await request.json();

    // Validate required fields
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user with same username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 400 }
      );
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      //  Create Admin User
      const adminUser = await tx.user.create({
        data: {
          name: name,
          username: username,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log("Admin user created:", {
        id: adminUser.id,
        name: adminUser.name,
        username: adminUser.username,
      });

      return {
        user: adminUser,
      };
    });

    return NextResponse.json({
      message: "Setup completed successfully",
      data: result.user,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to complete setup" },
      { status: 500 }
    );
  }
}
