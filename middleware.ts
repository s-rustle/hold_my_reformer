import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  if (path.startsWith("/member") || path.startsWith("/admin") || path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const login = new URL("/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", path);
      return Response.redirect(login);
    }
    if (path.startsWith("/member") && req.auth?.user?.role !== "MEMBER") {
      return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    if (path.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
      return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/member/:path*", "/admin/:path*", "/dashboard"],
};
