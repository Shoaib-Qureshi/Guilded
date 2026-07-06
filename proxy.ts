import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isPublic =
    publicRoutes.includes(pathname) || pathname.startsWith("/onboarding");

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
