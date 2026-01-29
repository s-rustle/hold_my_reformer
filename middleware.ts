import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isLoggedIn = !!token;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/member") || path.startsWith("/admin") || path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    const role = token?.role as string | undefined;
    if (path.startsWith("/member") && role !== "MEMBER") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*", "/dashboard"],
};
