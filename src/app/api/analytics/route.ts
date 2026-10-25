import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import {
  recordPageView,
  recordAnalyticsEvent,
  getTotalVisitors,
  getVisitorsByPeriod,
  getVisitorsByField,
  getTopPages,
} from "@/lib/analytics";

const pageViewSchema = z.object({
  type: z.literal("pageview"),
  path: z.string().min(1),
  referrer: z.string().optional(),
  country: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  sessionId: z.string().optional(),
  duration: z.number().optional(),
});

const eventSchema = z.object({
  type: z.string(),
  path: z.string().optional(),
  referrer: z.string().optional(),
  country: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === "pageview") {
    const parsed = pageViewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    await recordPageView({
      path: parsed.data.path,
      referrer: parsed.data.referrer,
      country: parsed.data.country,
      device: parsed.data.device,
      browser: parsed.data.browser,
      sessionId: parsed.data.sessionId,
      duration: parsed.data.duration,
    });
    return NextResponse.json({ success: true });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  await recordAnalyticsEvent({
    eventType: parsed.data.type,
    ...parsed.data,
  });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  switch (action) {
    case "totals": {
      const totals = await getTotalVisitors();
      return NextResponse.json(totals);
    }
    case "by-period": {
      const period = (searchParams.get("period") as "daily" | "weekly" | "monthly") || "daily";
      const data = await getVisitorsByPeriod(period);
      return NextResponse.json(data);
    }
    case "by-field": {
      const field = (searchParams.get("field") as "country" | "device" | "browser" | "referrer") || "country";
      const data = await getVisitorsByField(field);
      return NextResponse.json(data);
    }
    case "top-pages": {
      const limit = Number(searchParams.get("limit")) || 10;
      const data = await getTopPages(limit);
      return NextResponse.json(data);
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
