"use client";

import { useEffect, useState, useCallback } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

const emptyForm = { name: "", category: "", level: 50, order: 0 };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      setSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const url = editingId ? "/api/skills" : "/api/skills";
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, id: editingId } : form;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage({ type: "success", text: editingId ? "Skill updated" : "Skill created" });
        setForm(emptyForm);
        setEditingId(null);
        fetchSkills();
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error?.fieldErrors ? Object.values(err.error.fieldErrors).flat().join(", ") : "Failed to save skill" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      fetchSkills();
    } catch {
      setMessage({ type: "error", text: "Delete failed" });
    }
  }

  function handleEdit(skill: Skill) {
    setForm({ name: skill.name, category: skill.category, level: skill.level, order: skill.order });
    setEditingId(skill.id);
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Skills</h1>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <GlassCard>
        <h2 className="mb-4 text-xl font-semibold text-white">
          {editingId ? "Edit Skill" : "Add New Skill"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                required
                placeholder="e.g. Frontend, Backend"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Level ({form.level}%)</label>
              <input
                type="range"
                min={1}
                max={100}
                value={form.level}
                onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) }))}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <GradientButton type="submit">
              {editingId ? "Update Skill" : "Add Skill"}
            </GradientButton>
            {editingId && (
              <GradientButton type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </GradientButton>
            )}
          </div>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 text-xl font-semibold text-white">All Skills</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <p className="text-gray-400">No skills yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Level</th>
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id} className="border-b border-white/5 text-white last:border-0">
                    <td className="py-3 pr-4">{skill.name}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400">
                        {skill.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{skill.level}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{skill.order}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="rounded px-3 py-1 text-xs text-blue-400 transition hover:bg-blue-500/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="rounded px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
