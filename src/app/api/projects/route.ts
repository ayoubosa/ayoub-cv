import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).optional(),
  techBadges: z.array(z.string()).optional(),
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  category: z.string().min(1),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

type ProjectInput = z.infer<typeof projectSchema>;

function toDb(data: ProjectInput): Prisma.ProjectCreateInput {
  return {
    ...data,
    images: data.images ? JSON.stringify(data.images) : "[]",
    techBadges: data.techBadges ? JSON.stringify(data.techBadges) : "[]",
  };
}

function fromDb(project: Record<string, unknown>) {
  return {
    ...project,
    images: typeof project.images === "string" ? JSON.parse(project.images as string) : [],
    techBadges: typeof project.techBadges === "string" ? JSON.parse(project.techBadges as string) : [],
  };
}

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects.map(fromDb));
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const project = await prisma.project.create({ data: toDb(parsed.data) });
  return NextResponse.json(fromDb(project as unknown as Record<string, unknown>), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const project = await prisma.project.update({
    where: { id },
    data: toDb(data as ProjectInput),
  });
  return NextResponse.json(fromDb(project as unknown as Record<string, unknown>));
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
