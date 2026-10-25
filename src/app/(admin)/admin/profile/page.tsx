"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface Profile {
  id: string;
  name: string;
  title: string;
  nationality: string;
  locations: string;
  email: string;
  phones: string;
  about: string;
  photo: string | null;
}

export default function ProfilePage() {
  const [, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    name: "",
    title: "",
    nationality: "",
    locations: "",
    email: "",
    phones: "",
    about: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || "",
          title: data.title || "",
          nationality: data.nationality || "",
          locations: data.locations || "",
          email: data.email || "",
          phones: data.phones || "",
          about: data.about || "",
        });
        setPhotoPreview(data.photo || null);
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load profile" }));
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, photo: data.url }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Profile saved successfully" });
      } else {
        setMessage({ type: "error", text: "Failed to save profile" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Edit Profile</h1>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard>
          <h2 className="mb-4 text-xl font-semibold text-white">Personal Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Nationality</label>
              <input
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Locations</label>
              <input
                name="locations"
                value={form.locations}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Phones</label>
              <input
                name="phones"
                value={form.phones}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-xl font-semibold text-white">About</h2>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
            required
          />
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-xl font-semibold text-white">Photo</h2>
          {photoPreview && (
            <div className="mb-4">
              <img
                src={photoPreview}
                alt="Profile"
                className="h-32 w-32 rounded-full border-2 border-white/10 object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white"
          />
        </GlassCard>

        <div className="flex justify-end">
          <GradientButton type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </GradientButton>
        </div>
      </form>
    </div>
  );
}
