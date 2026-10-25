import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1),
  coverImage: z.string().nullable().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const tagId = searchParams.get("tagId");
  const published = searchParams.get("published");

  const where: Prisma.BlogPostWhereInput = {};
  if (categoryId) where.categoryId = categoryId;
  if (tagId) where.tags = { some: { id: tagId } };
  if (published !== null) where.published = published === "true";

  const posts = await prisma.blogPost.findMany({
    where,
    include: { category: true, tags: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { tagIds, ...data } = parsed.data;
  const post = await prisma.blogPost.create({
    data: {
      ...data,
      tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { category: true, tags: true },
  });
  return NextResponse.json(post, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, tagIds, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      tags: tagIds ? { set: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { category: true, tags: true },
  });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
