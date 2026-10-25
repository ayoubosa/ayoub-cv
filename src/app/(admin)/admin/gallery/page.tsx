"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface GalleryImage {
  id: string;
  url: string;
  order: number;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
        if (res.ok) ok++;
        else showMsg("error", "Upload failed");
      } catch {
        showMsg("error", "Network error");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    await fetchImages();
    if (ok > 0) showMsg("success", `${ok} photo${ok > 1 ? "s" : ""} uploaded`);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("success", "Photo deleted");
        await fetchImages();
      } else {
        showMsg("error", "Delete failed");
      }
    } catch {
      showMsg("error", "Network error");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setImages(reordered);
    try {
      await fetch("/api/admin/gallery/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((img) => img.id) }),
      });
    } catch {
      showMsg("error", "Reorder failed");
      await fetchImages();
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gallery</h1>
        <div className="flex items-center gap-3">
          {uploading && (
            <span className="text-xs text-white/50 animate-pulse">Uploading…</span>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <GradientButton onClick={() => fileRef.current?.click()} disabled={uploading}>
            + Upload Photos
          </GradientButton>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm px-4 py-2 rounded-xl ${
            message.type === "success"
              ? "bg-green-500/15 text-green-400 border border-green-500/25"
              : "bg-red-500/15 text-red-400 border border-red-500/25"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : images.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-white/40 text-sm">No photos yet. Upload some above.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <GlassCard key={img.id} className="overflow-hidden p-0 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Gallery photo ${index + 1}`}
                className="w-full aspect-[3/4] object-cover"
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="px-2 py-1 rounded bg-white/10 text-white text-xs disabled:opacity-30 hover:bg-white/20 transition"
                    title="Move left"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    className="px-2 py-1 rounded bg-white/10 text-white text-xs disabled:opacity-30 hover:bg-white/20 transition"
                    title="Move right"
                  >
                    →
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="px-3 py-1 rounded-lg bg-red-500/80 text-white text-xs hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 text-white/60 text-[10px] px-1.5 py-0.5 rounded">
                #{index + 1}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
