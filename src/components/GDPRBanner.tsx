"use client";

import { useState, useEffect } from "react";

export default function GDPRConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gdpr-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("gdpr-consent", "all");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("gdpr-consent", "none");
    setVisible(false);
  }

  function customize() {
    localStorage.setItem("gdpr-consent", "analytics");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 p-4 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-300">
          We use cookies to analyze traffic and improve your experience.
        </p>
        <div className="flex gap-3">
          <button onClick={accept} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Accept All</button>
          <button onClick={customize} className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white">Analytics Only</button>
          <button onClick={reject} className="rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-400">Reject</button>
        </div>
      </div>
    </div>
  );
}
