import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const hasUsername = !!token?.username;
  const { pathname } = req.nextUrl;

  if (!isAuth && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && !hasUsername && pathname !== "/setup") {
    return NextResponse.redirect(new URL("/setup", req.url));
  }

  if (isAuth && hasUsername && pathname === "/setup") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // FORCE ONBOARDING
  if (isAuth && hasUsername && token?.onboarded === false && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/setup"],
};