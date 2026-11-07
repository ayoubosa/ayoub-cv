import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { findAdminByEmail, verifyPassword, signAccessToken, signRefreshToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Failed attempts per address, stored in the database so every server instance sees the same count
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Compared against when the email is unknown, so both cases take the same time
const DUMMY_HASH = "$2b$12$Uk3ODiP8yljYEsQ8DeP/IeEbKhZdT38juHOU4xdepVl3eD/mpdxA.";

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const since = new Date(Date.now() - WINDOW_MS);
  const failures = await prisma.loginAttempt.count({ where: { ip, createdAt: { gt: since } } });
  if (failures >= MAX_FAILURES) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await findAdminByEmail(email);
  const valid = await verifyPassword(password, admin?.password ?? DUMMY_HASH);
  if (!admin || !valid) {
    await prisma.loginAttempt.create({ data: { ip } });
    await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: since } } });
    const left = MAX_FAILURES - failures - 1;
    return NextResponse.json(
      { error: left > 0 ? `Invalid credentials. ${left} ${left === 1 ? "try" : "tries"} left.` : "Too many attempts. Try again in 15 minutes." },
      { status: 401 }
    );
  }

  await prisma.loginAttempt.deleteMany({ where: { ip } });

  const payload = { id: admin.id, email: admin.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 min
  });
  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
