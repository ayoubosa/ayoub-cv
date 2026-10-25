import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import { CV_COOKIE, CV_TTL_SECONDS, createCvToken } from "@/lib/cvAccess";

// Note: in-memory limits reset on cold starts (serverless). They slow down
// guessing but are not a hard guarantee; use a long passcode and rotate it.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW = 15 * 60 * 1000;
const PER_IP_MAX = 5;
const GLOBAL_MAX = 50;

function hit(key: string, max: number): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "unknown";
  if (!hit(`ip:${ip}`, PER_IP_MAX) || !hit("global", GLOBAL_MAX)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let code: unknown;
  try {
    ({ code } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const passcode = process.env.CV_PASSCODE;
  if (!passcode) {
    return NextResponse.json({ error: "CV passcode not configured" }, { status: 500 });
  }

  if (typeof code !== "string" || !timingSafeEqual(digest(code), digest(passcode))) {
    return NextResponse.json({ error: "Wrong passcode" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(CV_COOKIE, await createCvToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CV_TTL_SECONDS,
  });
  return response;
}
