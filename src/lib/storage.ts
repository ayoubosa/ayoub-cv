import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // dir exists
  }
}

export async function uploadFile(
  file: File,
  subfolder: string = ""
): Promise<string> {
  await ensureDir();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const dir = subfolder ? path.join(UPLOAD_DIR, subfolder) : UPLOAD_DIR;
  if (path.relative(UPLOAD_DIR, dir).startsWith("..")) throw new Error("Invalid upload path");
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, uniqueName);
  await writeFile(filePath, buffer);
  return `/uploads/${subfolder ? subfolder + "/" : ""}${uniqueName}`;
}

export async function deleteFile(urlPath: string): Promise<void> {
  const filePath = path.join(process.cwd(), "public", urlPath);
  if (path.relative(UPLOAD_DIR, filePath).startsWith("..")) return;
  try {
    await unlink(filePath);
  } catch {
    // file doesn't exist
  }
}

export async function replaceFile(
  file: File,
  oldUrl: string | null,
  subfolder: string = ""
): Promise<string> {
  if (oldUrl) {
    await deleteFile(oldUrl);
  }
  return uploadFile(file, subfolder);
}
