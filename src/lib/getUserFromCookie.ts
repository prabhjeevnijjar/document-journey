import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  iat?: number;
  exp?: number;
}
export async function getUserFromCookie(): Promise<JWTPayload | null> {
  // Add type assertion to handle ReadonlyRequestCookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}
