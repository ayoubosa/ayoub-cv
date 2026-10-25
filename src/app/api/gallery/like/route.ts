import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 5_000;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const last = cooldowns.get(ip) ?? 0;
  if (now - last < COOLDOWN_MS) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  cooldowns.set(ip, now);

  // Atomic: increment any existing row, create if none exist.
  // updateMany is atomic per-row; the create only runs when no row exists.
  const updated = await prisma.galleryStats.updateMany({
    data: { likeCount: { increment: 1 } },
  });

  if (updated.count === 0) {
    await prisma.galleryStats.create({ data: { likeCount: 1 } });
  }

  const stats = await prisma.galleryStats.findFirst();
  return NextResponse.json({ count: stats?.likeCount ?? 1 });
}
