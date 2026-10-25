import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const theme = await prisma.themeSettings.findFirst();
  if (!theme) {
    const created = await prisma.themeSettings.create({ data: {} });
    return NextResponse.json(created);
  }
  return NextResponse.json(theme);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await prisma.themeSettings.findFirst();
  if (!existing) {
    const created = await prisma.themeSettings.create({ data: body });
    return NextResponse.json(created);
  }
  const theme = await prisma.themeSettings.update({
    where: { id: existing.id },
    data: body,
  });
  return NextResponse.json(theme);
}
