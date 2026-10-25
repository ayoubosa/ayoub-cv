import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";
import QRCode from "qrcode";

const linkSchema = z.object({
  slug: z.string().min(1),
  sourceLabel: z.string().min(1),
  target: z.string().url(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const slug = searchParams.get("slug");

  if (action === "qrcode" && slug) {
    const link = await prisma.smartLink.findUnique({ where: { slug } });
    if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qr = await QRCode.toDataURL(`${baseUrl}/api/go/${link.slug}`, { width: 400, margin: 2 });
    return NextResponse.json({ qr });
  }

  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.smartLink.findMany({
    include: { clicks: { orderBy: { timestamp: "desc" }, take: 100 } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const link = await prisma.smartLink.create({ data: parsed.data });
  return NextResponse.json(link, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const link = await prisma.smartLink.update({ where: { id }, data });
  return NextResponse.json(link);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.linkClick.deleteMany({ where: { smartLinkId: id } });
  await prisma.smartLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
