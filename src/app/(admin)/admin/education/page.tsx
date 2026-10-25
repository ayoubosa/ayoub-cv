"use client";

import { useState, useEffect } from "react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
}

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [edit, setEdit] = useState<Partial<Education> | null>(null);

  useEffect(() => { fetch("/api/education").then(r => r.json()).then(setItems); }, []);

  async function save() {
    const method = edit?.id ? "PUT" : "POST";
    const res = await fetch("/api/education", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(edit) });
    if (res.ok) { setEdit(null); setItems(await fetch("/api/education").then(r => r.json())); }
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/education?id=${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Education</h1>
      <button onClick={() => setEdit({ institution: "", degree: "", field: "", startDate: "", current: false, description: "" })} className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white">Add Education</button>
      {edit && (
        <div className="mb-8 glass p-6 space-y-4 rounded-xl">
          <input placeholder="Institution" value={edit.institution || ""} onChange={e => setEdit({...edit, institution: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Degree" value={edit.degree || ""} onChange={e => setEdit({...edit, degree: e.target.value})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
            <input placeholder="Field" value={edit.field || ""} onChange={e => setEdit({...edit, field: e.target.value})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={edit.startDate?.slice(0,10) || ""} onChange={e => setEdit({...edit, startDate: e.target.value})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />
            {!edit.current && <input type="date" value={edit.endDate?.slice(0,10) || ""} onChange={e => setEdit({...edit, endDate: e.target.value})} className="rounded border border-white/10 bg-white/5 p-3 text-white" />}
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={edit.current || false} onChange={e => setEdit({...edit, current: e.target.checked})} /><span>Currently studying</span></label>
          <textarea placeholder="Description" value={edit.description || ""} onChange={e => setEdit({...edit, description: e.target.value})} className="w-full rounded border border-white/10 bg-white/5 p-3 text-white" rows={2} />
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
                <h3 className="text-lg font-semibold">{item.degree} in {item.field}</h3>
                <p className="text-sm text-gray-400">{item.institution}</p>
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
