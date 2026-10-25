import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { replaceFile, deleteFile } from "@/lib/storage";
import { prisma } from "@/lib/db";

export async function GET() {
  const profile = await prisma.profile.findFirst({
    select: { resumeFile: true },
  });
  if (!profile?.resumeFile) {
    return NextResponse.json({ error: "No resume found" }, { status: 404 });
  }
  return NextResponse.json({ url: profile.resumeFile });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const profile = await prisma.profile.findFirst();
  const oldUrl = profile?.resumeFile || null;
  const url = await replaceFile(file, oldUrl, "resume");

  if (profile) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { resumeFile: url },
    });
  }

  return NextResponse.json({ url });
}

export async function DELETE() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst();
  if (profile?.resumeFile) {
    await deleteFile(profile.resumeFile);
    await prisma.profile.update({
      where: { id: profile.id },
      data: { resumeFile: null },
    });
  }

  return NextResponse.json({ success: true });
}
