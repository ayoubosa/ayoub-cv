import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let stats = await prisma.galleryStats.findFirst();
  if (!stats) {
    stats = await prisma.galleryStats.create({ data: {} });
  }
  return NextResponse.json({ count: stats.likeCount });
}
