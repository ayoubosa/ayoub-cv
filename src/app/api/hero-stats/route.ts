import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const statSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  order: z.number().optional(),
});

export async function GET() {
  const stats = await prisma.heroStat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = statSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const stat = await prisma.heroStat.create({ data: parsed.data });
  return NextResponse.json(stat, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const stat = await prisma.heroStat.update({ where: { id }, data });
  return NextResponse.json(stat);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.heroStat.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
