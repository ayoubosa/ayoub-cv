import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  content: z.string().min(1),
  avatar: z.string().nullable().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  order: z.number().optional(),
});

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const testimonial = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json(testimonial, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const testimonial = await prisma.testimonial.update({ where: { id }, data });
  return NextResponse.json(testimonial);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
