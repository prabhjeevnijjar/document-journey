import jwt from "jsonwebtoken";

export interface JWTPayload {
  sub: number;
  iat?: number;
  exp?: number;
}
export function getUserFromCookie(): string | null {
  try {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return null;
    }

    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token")
    );
    console.log("Token cookie found:", tokenCookie);

    if (!tokenCookie) {
      return null;
    }

    const token = decodeURIComponent(tokenCookie.split("=")[1]);

    return token;
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
}
