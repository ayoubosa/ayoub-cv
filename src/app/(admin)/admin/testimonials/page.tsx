"use client";
import { useState, useEffect } from "react";
interface Testimonial { id: string; name: string; role?: string; company?: string; content: string; avatar?: string; rating?: number; order: number; }

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [edit, setEdit] = useState<Partial<Testimonial> | null>(null);
  useEffect(() => { fetch("/api/testimonials").then(r => r.json()).then(setItems); }, []);
  async function save() {
    const method = edit?.id ? "PUT" : "POST";
    const res = await fetch("/api/testimonials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    if (res.ok) { setEdit(null); setItems(await fetch("/api/testimonials").then(r => r.json())); }
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  }
  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Testimonials</h1>
      <button onClick={() => setEdit({ name: "", content: "", rating: 5, order: 0 })} className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white">Add Testimonial</button>
      {edit && (
        <div className="mb-8 glass p-6 space-y-4 rounded-xl">
          <input placeholder="Name" value={edit.name || ""} onChange={e => setEdit({...edit, name: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Role" value={edit.role || ""} onChange={e => setEdit({...edit, role: e.target.value})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
            <input placeholder="Company" value={edit.company || ""} onChange={e => setEdit({...edit, company: e.target.value})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
          </div>
          <textarea placeholder="Content" value={edit.content || ""} onChange={e => setEdit({...edit, content: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" min={1} max={5} placeholder="Rating" value={edit.rating || 5} onChange={e => setEdit({...edit, rating: parseInt(e.target.value)})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
            <input type="number" placeholder="Order" value={edit.order || 0} onChange={e => setEdit({...edit, order: parseInt(e.target.value)})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="rounded-lg bg-green-600 px-4 py-2 text-white">Save</button>
            <button onClick={() => setEdit(null)} className="rounded-lg bg-gray-600 px-4 py-2 text-white">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="glass rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.role}{item.company ? ` · ${item.company}` : ""}</p>
                <p className="mt-2 text-gray-300">{item.content}</p>
                {item.rating && <div className="mt-2 text-yellow-400">{'★'.repeat(item.rating)}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEdit(item)} className="text-sm text-blue-400">Edit</button>
                <button onClick={() => remove(item.id)} className="text-sm text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
