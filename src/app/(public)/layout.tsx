import type { ReactNode } from "react";
import CommandPalette from "@/components/CommandPalette";
import GDPRBanner from "@/components/GDPRBanner";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <CommandPalette />
      <GDPRBanner />
      <AnalyticsBeacon />
      {children}
    </main>
  );
}
