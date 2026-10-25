import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyHs256 } from "@/lib/edgeJwt";
import { CV_COOKIE, verifyCvToken } from "@/lib/cvAccess";

const publicPaths = [
  "/admin/login",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/contact",
  "/api/go",
  "/api/analytics",
  "/api/cv-unlock",
  "/api/gallery/like",
];

const mutatingMethods = ["POST", "PUT", "PATCH", "DELETE"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Protect CV route
  if (pathname === "/cv" || pathname === "/cv.pdf") {
    if (!(await verifyCvToken(request.cookies.get(CV_COOKIE)?.value))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("access_token")?.value;
    if (!(await verifyHs256(token, process.env.JWT_SECRET))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect mutating API routes
  if (
    pathname.startsWith("/api/") &&
    mutatingMethods.includes(request.method)
  ) {
    const token = request.cookies.get("access_token")?.value;
    if (!(await verifyHs256(token, process.env.JWT_SECRET))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/cv", "/cv.pdf"],
};
