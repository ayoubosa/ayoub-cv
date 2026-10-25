"use client";
import { useState, useEffect } from "react";

export default function AdminResumePage() {
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetch("/api/resume").then(r => r.ok ? r.json() : null).then(d => d && setUrl(d.url)); }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/resume", { method: "POST", body: formData });
    if (res.ok) { const d = await res.json(); setUrl(d.url); }
    setUploading(false);
  }

  async function remove() {
    if (!confirm("Delete resume?")) return;
    await fetch("/api/resume", { method: "DELETE" });
    setUrl(null);
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Resume Management</h1>
      <div className="glass space-y-6 rounded-xl p-8">
        {url && (
          <div className="flex items-center gap-4">
            <span className="text-green-400">✓</span>
            <a href={url} target="_blank" className="text-blue-400 hover:underline">View current resume</a>
            <button onClick={remove} className="text-sm text-red-400">Delete</button>
          </div>
        )}
        <div>
          <label className="block cursor-pointer rounded-lg border-2 border-dashed border-white/20 p-8 text-center hover:border-blue-400">
            <p className="mb-2 text-gray-400">{uploading ? "Uploading..." : "Click to upload PDF"}</p>
            <p className="text-sm text-gray-500">Max 10MB, PDF only</p>
            <input type="file" accept=".pdf" onChange={upload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
