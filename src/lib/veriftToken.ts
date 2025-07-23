// src/lib/verifyToken.ts
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // Contains decoded token like { id, email, ... }
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}
