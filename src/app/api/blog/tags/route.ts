import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const tags = await prisma.blogTag.findMany();
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const tag = await prisma.blogTag.create({ data: parsed.data });
  return NextResponse.json(tag, { status: 201 });
}
