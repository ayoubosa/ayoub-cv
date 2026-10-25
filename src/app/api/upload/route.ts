import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const subfolder = ((formData.get("subfolder") as string) || "").trim();

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (subfolder && !/^[a-z0-9_-]{1,40}$/i.test(subfolder)) {
    return NextResponse.json({ error: "Invalid subfolder" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Unsupported file type or file too large" }, { status: 400 });
  }

  const url = await uploadFile(file, subfolder);
  return NextResponse.json({ url });
}
