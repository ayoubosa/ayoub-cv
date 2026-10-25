"use client";

import { useState, useEffect } from "react";
interface Service { id: string; title: string; description: string; icon: string; order: number; }

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [edit, setEdit] = useState<Partial<Service> | null>(null);
  useEffect(() => { fetch("/api/services").then(r => r.json()).then(setItems); }, []);
  async function save() {
    const method = edit?.id ? "PUT" : "POST";
    const res = await fetch("/api/services", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    if (res.ok) { setEdit(null); setItems(await fetch("/api/services").then(r => r.json())); }
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  }
  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Services</h1>
      <button onClick={() => setEdit({ title: "", description: "", icon: "Globe", order: 0 })} className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white">Add Service</button>
      {edit && (
        <div className="mb-8 glass p-6 space-y-4 rounded-xl">
          <input placeholder="Title" value={edit.title || ""} onChange={e => setEdit({...edit, title: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <textarea placeholder="Description" value={edit.description || ""} onChange={e => setEdit({...edit, description: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" rows={2} />
          <input placeholder="Icon name" value={edit.icon || ""} onChange={e => setEdit({...edit, icon: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-green-600 px-4 py-2 text-white">Save</button>
            <button onClick={() => setEdit(null)} className="rounded-lg bg-gray-600 px-4 py-2 text-white">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="glass rounded-xl p-6">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-400">{item.description}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEdit(item)} className="text-sm text-blue-400">Edit</button>
              <button onClick={() => remove(item.id)} className="text-sm text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
