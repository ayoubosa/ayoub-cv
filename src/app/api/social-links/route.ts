import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const linkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().nullable().optional(),
  order: z.number().optional(),
});

export async function GET() {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const link = await prisma.socialLink.create({ data: parsed.data });
  return NextResponse.json(link, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const link = await prisma.socialLink.update({ where: { id }, data });
  return NextResponse.json(link);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.socialLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
