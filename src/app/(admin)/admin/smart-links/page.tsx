"use client";

import { useState, useEffect } from "react";

interface SmartLink {
  id: string;
  slug: string;
  sourceLabel: string;
  target: string;
  clicks?: { id: string; timestamp: string; referrer?: string; country?: string; device?: string; browser?: string }[];
  createdAt: string;
}

export default function AdminSmartLinksPage() {
  const [links, setLinks] = useState<SmartLink[]>([]);
  const [edit, setEdit] = useState<Partial<SmartLink> | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/smart-links").then(r => { if (r.ok) return r.json(); return []; }).then(setLinks).catch(() => {});
  }, []);

  async function save() {
    const method = edit?.id ? "PUT" : "POST";
    try {
      const res = await fetch("/api/smart-links", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
      if (res.ok) { setEdit(null); setLinks(await fetch("/api/smart-links").then(r => r.json())); }
    } catch {}
  }

  async function remove(id: string) {
    if (!confirm("Delete link?")) return;
    await fetch(`/api/smart-links?id=${id}`, { method: "DELETE" });
    setLinks(links.filter(l => l.id !== id));
  }

  async function generateQR(id: string, slug: string) {
    const res = await fetch(`/api/smart-links?action=qrcode&slug=${slug}`);
    if (res.ok) { const d = await res.json(); setQrCode(d.qr); }
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Smart Links</h1>
      <button onClick={() => setEdit({ slug: "", sourceLabel: "", target: "" })} className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white">Create Link</button>
      {edit && (
        <div className="mb-8 glass p-6 space-y-4 rounded-xl">
          <input placeholder="Slug (e.g. tiktok)" value={edit.slug || ""} onChange={e => setEdit({...edit, slug: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white font-mono" />
          <input placeholder="Source Label (e.g. TikTok Profile)" value={edit.sourceLabel || ""} onChange={e => setEdit({...edit, sourceLabel: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <input placeholder="Target URL" value={edit.target || ""} onChange={e => setEdit({...edit, target: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-green-600 px-4 py-2 text-white">Save</button>
            <button onClick={() => setEdit(null)} className="rounded-lg bg-gray-600 px-4 py-2 text-white">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {links.map(link => (
          <div key={link.id} className="glass rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{link.sourceLabel}</h3>
                <p className="font-mono text-sm text-blue-400">/go/{link.slug}</p>
                <p className="mt-1 text-sm text-gray-400">{link.target}</p>
                <p className="mt-2 text-sm text-gray-500">{link.clicks?.length || 0} clicks</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setEdit(link)} className="text-sm text-blue-400">Edit</button>
                <button onClick={() => generateQR(link.id, link.slug)} className="text-sm text-green-400">QR</button>
                <button onClick={() => remove(link.id)} className="text-sm text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {qrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setQrCode(null)}>
          <div className="glass rounded-xl p-8" onClick={e => e.stopPropagation()}>
            <img src={qrCode} alt="QR Code" className="h-64 w-64" />
            <button onClick={() => setQrCode(null)} className="mt-4 w-full rounded-lg bg-gray-600 px-4 py-2 text-white">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
