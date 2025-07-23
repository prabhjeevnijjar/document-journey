import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/veriftToken";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/activity/:path*",
    "/agreements/:path*",
    "/contacts/:path*",
    "/documents/:path*",
    "/login",
    "/signup",
  ],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (!token) {
    if (isAuthRoute) {
      return NextResponse.next(); // allow access to /login or /signup
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await verifyToken(token);
  if (!user) {
    if (isAuthRoute) {
      return NextResponse.next(); // allow if token invalid and user on /login
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ If logged in, block access to /login or /signup
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // allow access to protected pages
}
