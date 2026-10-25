"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    const consent = localStorage.getItem("gdpr-consent");
    if (consent === "none") return;

    const data: Record<string, string> = {
      type: "pageview",
      path: pathname,
      referrer: document.referrer || "",
      browser: navigator.userAgent,
      sessionId: sessionStorage.getItem("sessionId") || crypto.randomUUID(),
    };

    if (!sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", data.sessionId);
    }

    const device = /mobile|tablet/i.test(navigator.userAgent) ? "mobile" : "desktop";
    data.device = device;

    navigator.sendBeacon(
      "/api/analytics",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
  }, [pathname]);

  return null;
}
