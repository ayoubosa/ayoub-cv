import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().datetime().or(z.string()),
  endDate: z.string().datetime().or(z.string()).nullable().optional(),
  current: z.boolean().optional(),
  description: z.string().min(1),
  order: z.number().optional(),
});

export async function GET() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(experiences);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const experience = await prisma.experience.create({ data: { ...parsed.data, startDate: new Date(parsed.data.startDate), endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null } });
  return NextResponse.json(experience, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const experience = await prisma.experience.update({ where: { id }, data: { ...data, startDate: data.startDate ? new Date(data.startDate) : undefined, endDate: data.endDate ? new Date(data.endDate) : data.endDate === null ? null : undefined } });
  return NextResponse.json(experience);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
