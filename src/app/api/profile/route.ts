import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  nationality: z.string().min(1),
  locations: z.string().min(1),
  email: z.string().email(),
  phones: z.string().min(1),
  about: z.string().min(1),
  photo: z.string().nullable().optional(),
  resumeFile: z.string().nullable().optional(),
});

export async function GET() {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 404 });
  }
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.profile.findFirst({ select: { id: true } });
  const profile = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.profile.create({ data: parsed.data });

  return NextResponse.json(profile);
}
