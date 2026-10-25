import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const categories = await prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const category = await prisma.blogCategory.create({ data: parsed.data });
  return NextResponse.json(category, { status: 201 });
}
