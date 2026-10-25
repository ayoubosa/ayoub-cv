import { Prisma } from "@prisma/client";
import { prisma } from "./db";

export async function recordPageView(data: {
  path: string;
  referrer?: string;
  country?: string;
  device?: string;
  browser?: string;
  sessionId?: string;
  duration?: number;
}) {
  return prisma.pageView.create({ data });
}

export async function recordAnalyticsEvent(data: {
  eventType: string;
  path?: string;
  referrer?: string;
  country?: string;
  device?: string;
  browser?: string;
  sessionId?: string;
  metadata?: string;
}) {
  return prisma.analyticsEvent.create({ data });
}

export async function getTotalVisitors() {
  const [total, [uniqueResult]] = await Promise.all([
    prisma.pageView.count(),
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(DISTINCT "sessionId")::bigint AS count
      FROM "PageView"
      WHERE "sessionId" IS NOT NULL
    `,
  ]);
  return {
    total,
    uniqueSessions: Number(uniqueResult.count),
  };
}

export async function getVisitorsByPeriod(
  period: "daily" | "weekly" | "monthly"
) {
  const trunc = period === "daily" ? "day" : period === "weekly" ? "week" : "month";
  const rows = await prisma.$queryRaw<{ date: Date; count: bigint }[]>(
    Prisma.sql`
      SELECT DATE_TRUNC(${trunc}, "timestamp") AS date, COUNT(*)::bigint AS count
      FROM "PageView"
      GROUP BY 1
      ORDER BY 1 ASC
    `
  );
  return rows.map((r) => ({
    date: r.date.toISOString().slice(0, 10),
    count: Number(r.count),
  }));
}

const ALLOWED_FIELDS = ["country", "device", "browser", "referrer"] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function getVisitorsByField(
  field: "country" | "device" | "browser" | "referrer"
) {
  if (!ALLOWED_FIELDS.includes(field as AllowedField)) {
    throw new Error("Invalid field");
  }
  const rows = await prisma.$queryRaw<{ name: string | null; count: bigint }[]>(
    Prisma.sql`
      SELECT ${Prisma.raw(`"${field}"`)} AS name, COUNT(*)::bigint AS count
      FROM "PageView"
      WHERE ${Prisma.raw(`"${field}"`)} IS NOT NULL
      GROUP BY 1
      ORDER BY count DESC
    `
  );
  return rows.map((r) => ({ name: r.name ?? "Unknown", count: Number(r.count) }));
}

export async function getTopPages(limit: number = 10) {
  const views = await prisma.pageView.groupBy({
    by: ["path"],
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });
  return views.map((v) => ({ path: v.path, count: v._count.path }));
}
