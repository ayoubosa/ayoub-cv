"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const commands = [
  { label: "Home", action: "/" },
  { label: "About", action: "/#about" },
  { label: "Skills", action: "/#skills" },
  { label: "Projects", action: "/#projects" },
  { label: "Blog", action: "/blog" },
  { label: "Contact", action: "/#contact" },
  { label: "Admin Dashboard", action: "/admin" },
  // { label: "Download CV", action: "/api/resume" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useCallback(
    (action: string) => {
      setOpen(false);
      setQuery("");
      if (action.startsWith("http") || action.startsWith("/api")) {
        window.open(action, "_blank");
      } else {
        router.push(action);
      }
    },
    [router]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="glass w-full max-w-lg rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          placeholder="Type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-b border-white/10 bg-transparent p-4 text-white outline-none placeholder-gray-500"
        />
        <div className="max-h-64 overflow-y-auto">
          {filtered.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => navigate(cmd.action)}
              className="w-full px-4 py-3 text-left text-sm text-gray-200 transition hover:bg-white/5"
            >
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No results</p>
          )}
        </div>
      </div>
    </div>
  );
}
