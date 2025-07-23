// lib/verifyToken.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(token: string) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // contains { id, email, ... }
  } catch {
    return null;
  }
}
