// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/veriftToken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedPaths = [
    "/dashboard",
    "/activity",
    "/agreements",
    "/contacts",
    "/documents"
  ];
  const isProtected = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: attach user data to headers if needed
  const res = NextResponse.next();
//   res.headers.set("x-user-id", user.id.toString());
  return res;
}
