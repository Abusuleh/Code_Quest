import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  const isParentRoute = pathname.startsWith("/parent");
  const isChildRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/placement");

  if (!token && (isParentRoute || isChildRoute)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (
    isParentRoute &&
    token?.role !== "PARENT" &&
    token?.role !== "EDUCATOR" &&
    token?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isChildRoute) {
    const hasChild = Boolean(token?.activeChildId);
    if (!hasChild) {
      return NextResponse.redirect(new URL("/parent/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/dashboard/:path*", "/placement/:path*"],
};
