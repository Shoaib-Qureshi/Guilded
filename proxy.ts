import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Optimistic check only — reads the session cookie, never the DB (this runs on every
// request, including prefetches). Real authorization happens in lib/dal.ts and in each
// server action; see docs/roles-and-permissions.md.
const publicRoutes = ["/", "/login", "/forgot-password"];
const publicPrefixes = ["/onboarding", "/invite"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isPublic =
    publicRoutes.includes(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
