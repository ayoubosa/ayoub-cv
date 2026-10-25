import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const link = await prisma.smartLink.findUnique({
    where: { slug: params.slug },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const country = _req.headers.get("x-vercel-ip-country") || undefined;
  const device = /mobile/i.test(_req.headers.get("user-agent") || "")
    ? "mobile"
    : "desktop";
  const browser = _req.headers.get("user-agent") || undefined;
  const referrer = _req.headers.get("referer") || undefined;

  await prisma.linkClick.create({
    data: {
      smartLinkId: link.id,
      referrer,
      country,
      device,
      browser,
    },
  });

  return NextResponse.redirect(link.target, 302);
}
