"use client";

import { useEffect, useState, useCallback } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  techBadges: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  order: number;
  images: string[];
}

const emptyForm = {
  title: "",
  description: "",
  category: "",
  techBadges: [] as string[],
  githubUrl: "",
  liveUrl: "",
  featured: false,
  order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [badgeInput, setBadgeInput] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function addBadge() {
    const tag = badgeInput.trim();
    if (tag && !form.techBadges.includes(tag)) {
      setForm((p) => ({ ...p, techBadges: [...p.techBadges, tag] }));
    }
    setBadgeInput("");
  }

  function removeBadge(tag: string) {
    setForm((p) => ({ ...p, techBadges: p.techBadges.filter((t) => t !== tag) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const body = {
      ...form,
      githubUrl: form.githubUrl || null,
      liveUrl: form.liveUrl || null,
    };
    const method = editingId ? "PUT" : "POST";
    const url = "/api/projects";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...body, id: editingId } : body),
      });
      if (res.ok) {
        setMessage({ type: "success", text: editingId ? "Project updated" : "Project created" });
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        fetchProjects();
      } else {
        setMessage({ type: "error", text: "Failed to save project" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      fetchProjects();
    } catch {
      setMessage({ type: "error", text: "Delete failed" });
    }
  }

  function handleEdit(project: Project) {
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      techBadges: project.techBadges || [],
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured,
      order: project.order,
    });
    setEditingId(project.id);
    setShowForm(true);
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setMessage(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <GradientButton onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          Add Project
        </GradientButton>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <GlassCard>
          <h2 className="mb-4 text-xl font-semibold text-white">
            {editingId ? "Edit Project" : "New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
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
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Tech Badges</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.techBadges.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
                  >
                    {tag}
                    <button type="button" onClick={() => removeBadge(tag)} className="hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBadge())}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white"
                  placeholder="Type and press Enter or Add"
                />
                <button type="button" onClick={addBadge} className="rounded-lg bg-white/10 px-3 text-sm text-white hover:bg-white/20">
                  Add
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-400">GitHub URL</label>
                <input
                  value={form.githubUrl}
                  onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Live URL</label>
                <input
                  value={form.liveUrl}
                  onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                  className="accent-blue-500"
                />
                Featured
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                  className="w-20 rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <GradientButton type="submit">
                {editingId ? "Update Project" : "Create Project"}
              </GradientButton>
              <GradientButton type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </GradientButton>
            </div>
          </form>
        </GlassCard>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <GlassCard key={project.id} hover>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-white">{project.title}</h3>
                {project.featured && (
                  <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-400 line-clamp-2">{project.description}</p>
              <p className="mt-2 text-xs text-blue-400">{project.category}</p>
              {project.techBadges.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.techBadges.map((badge) => (
                    <span key={badge} className="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-300">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="rounded px-3 py-1 text-xs text-blue-400 transition hover:bg-blue-500/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="rounded px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
