import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set in environment variables!");
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface SessionPayload {
  id: string;
  name: string;
  role: string;
  username: string;
  iat?: number;
  exp?: number;
}

export async function signJWT(payload: Omit<SessionPayload, "iat" | "exp">) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15d")
    .sign(secret);
  return token;
}

export async function verifyJWT(token: string): Promise<SessionPayload | null> {
  if (!token) {
    console.log("No token provided to verifyJWT");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Validate the payload has the required fields
    if (
      typeof payload.id === "string" &&
      typeof payload.name === "string" &&
      typeof payload.username === "string" &&
      typeof payload.role === "string"
    ) {
      // Use a type assertion through unknown to satisfy TypeScript
      return {
        id: payload.id,
        username: payload.username,
        name: payload.name,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
      } as SessionPayload;
    }

    console.error("Invalid payload structure:", payload);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT verification error:", {
        message: error.message,
        name: error.name,
        token: token.substring(0, 10) + "...", // Only log first 10 chars for security
      });
    }
    return null;
  }
}
