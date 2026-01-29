import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    console.warn(
      "Auth: Set NEXTAUTH_SECRET or AUTH_SECRET in .env (e.g. run: openssl rand -base64 32) so sign-in works."
    );
  }
  const token = secret
    ? await getToken({
        req,
        secret,
      })
    : null;
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
