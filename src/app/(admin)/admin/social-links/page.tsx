"use client";
import { useState, useEffect } from "react";
interface SocialLink { id: string; platform: string; url: string; icon?: string; order: number; }

export default function AdminSocialLinksPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [edit, setEdit] = useState<Partial<SocialLink> | null>(null);
  useEffect(() => { fetch("/api/social-links").then(r => r.json()).then(setItems); }, []);
  async function save() {
    const method = edit?.id ? "PUT" : "POST";
    const res = await fetch("/api/social-links", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    if (res.ok) { setEdit(null); setItems(await fetch("/api/social-links").then(r => r.json())); }
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/social-links?id=${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  }
  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Social Links</h1>
      <button onClick={() => setEdit({ platform: "", url: "", order: 0 })} className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white">Add Link</button>
      {edit && (
        <div className="mb-8 glass p-6 space-y-4 rounded-xl">
          <input placeholder="Platform (e.g. LinkedIn)" value={edit.platform || ""} onChange={e => setEdit({...edit, platform: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <input placeholder="URL" value={edit.url || ""} onChange={e => setEdit({...edit, url: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <input placeholder="Order" type="number" value={edit.order || 0} onChange={e => setEdit({...edit, order: parseInt(e.target.value)})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-green-600 px-4 py-2 text-white">Save</button>
            <button onClick={() => setEdit(null)} className="rounded-lg bg-gray-600 px-4 py-2 text-white">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="font-medium">{item.platform}</span>
              <span className="ml-3 text-sm text-gray-400">{item.url}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEdit(item)} className="text-sm text-blue-400">Edit</button>
              <button onClick={() => remove(item.id)} className="text-sm text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
