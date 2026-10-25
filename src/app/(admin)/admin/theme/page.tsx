"use client";
import { useState, useEffect } from "react";

interface ThemeSettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  darkMode: boolean;
}

export default function AdminThemePage() {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/theme").then(r => r.json()).then(setTheme); }, []);

  async function save() {
    if (!theme) return;
    const res = await fetch("/api/theme", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(theme) });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  }

  if (!theme) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Theme Settings</h1>
      <div className="glass space-y-6 rounded-xl p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Primary Color</label>
            <div className="flex gap-3">
              <input type="color" value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} className="h-10 w-10 rounded" />
              <input value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} className="flex-1 rounded border border-white/10 bg-white/5 p-3 text-white font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Secondary Color</label>
            <div className="flex gap-3">
              <input type="color" value={theme.secondaryColor} onChange={e => setTheme({...theme, secondaryColor: e.target.value})} className="h-10 w-10 rounded" />
              <input value={theme.secondaryColor} onChange={e => setTheme({...theme, secondaryColor: e.target.value})} className="flex-1 rounded border border-white/10 bg-white/5 p-3 text-white font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Accent Color</label>
            <div className="flex gap-3">
              <input type="color" value={theme.accentColor} onChange={e => setTheme({...theme, accentColor: e.target.value})} className="h-10 w-10 rounded" />
              <input value={theme.accentColor} onChange={e => setTheme({...theme, accentColor: e.target.value})} className="flex-1 rounded border border-white/10 bg-white/5 p-3 text-white font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Background Color</label>
            <div className="flex gap-3">
              <input type="color" value={theme.backgroundColor} onChange={e => setTheme({...theme, backgroundColor: e.target.value})} className="h-10 w-10 rounded" />
              <input value={theme.backgroundColor} onChange={e => setTheme({...theme, backgroundColor: e.target.value})} className="flex-1 rounded border border-white/10 bg-white/5 p-3 text-white font-mono text-sm" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Font Family</label>
            <input value={theme.fontFamily} onChange={e => setTheme({...theme, fontFamily: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Border Radius</label>
            <input value={theme.borderRadius} onChange={e => setTheme({...theme, borderRadius: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={theme.darkMode} onChange={e => setTheme({...theme, darkMode: e.target.checked})} id="darkMode" />
          <label htmlFor="darkMode">Dark Mode</label>
        </div>
        <button onClick={save} className="rounded-lg bg-green-600 px-6 py-3 text-white font-medium">{saved ? "Saved!" : "Save Theme"}</button>
      </div>
      <div className="mt-8 glass rounded-xl p-8">
        <h2 className="mb-4 text-xl font-semibold">Preview</h2>
        <div className="flex flex-wrap gap-4">
          <button style={{ backgroundColor: theme.primaryColor }} className="rounded px-4 py-2 text-white">Primary</button>
          <button style={{ backgroundColor: theme.secondaryColor }} className="rounded px-4 py-2 text-white">Secondary</button>
          <button style={{ backgroundColor: theme.accentColor }} className="rounded px-4 py-2 text-white">Accent</button>
        </div>
      </div>
    </div>
  );
}
