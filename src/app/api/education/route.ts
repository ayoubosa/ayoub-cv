import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  current: z.boolean().optional(),
  description: z.string().nullable().optional(),
  order: z.number().optional(),
});

export async function GET() {
  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(education);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = educationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const ed = await prisma.education.create({
    data: { ...parsed.data, startDate: new Date(parsed.data.startDate), endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null },
  });
  return NextResponse.json(ed, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ed = await prisma.education.update({ where: { id }, data });
  return NextResponse.json(ed);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.education.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
