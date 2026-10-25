import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const url = await uploadFile(file, "gallery");

  const maxOrder = await prisma.galleryImage.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const image = await prisma.galleryImage.create({ data: { url, order: nextOrder } });
  return NextResponse.json(image, { status: 201 });
}
