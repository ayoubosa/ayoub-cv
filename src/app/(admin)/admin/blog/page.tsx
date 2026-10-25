"use client";

import { useEffect, useState, useCallback } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  category: BlogCategory | null;
  tags: BlogTag[];
  createdAt: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "",
  tagIds: [] as string[],
  published: false,
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/blog/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMeta = useCallback(async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/blog/categories"),
        fetch("/api/blog/tags"),
      ]);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);
      }
      if (tagRes.ok) {
        const tagData = await tagRes.json();
        setTags(Array.isArray(tagData) ? tagData : []);
      }
    } catch {
      // meta fetch optional
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchMeta();
  }, [fetchPosts, fetchMeta]);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(title: string) {
    setForm((p) => ({
      ...p,
      title,
      slug: editingId ? p.slug : generateSlug(title),
    }));
  }

  function toggleTag(tagId: string) {
    setForm((p) => ({
      ...p,
      tagIds: p.tagIds.includes(tagId)
        ? p.tagIds.filter((id) => id !== tagId)
        : [...p.tagIds, tagId],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const body = {
      ...form,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      categoryId: form.categoryId || null,
    };
    const method = editingId ? "PUT" : "POST";
    const url = "/api/blog/posts";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...body, id: editingId } : body),
      });
      if (res.ok) {
        setMessage({ type: "success", text: editingId ? "Post updated" : "Post created" });
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        fetchPosts();
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error?.fieldErrors ? Object.values(err.error.fieldErrors).flat().join(", ") : "Failed to save post" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  async function handleDeleteById(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch(`/api/blog/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: "success", text: "Post deleted" });
        fetchPosts();
      } else {
        setMessage({ type: "error", text: "Delete failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    }
  }

  function handleEdit(post: BlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || "",
      categoryId: post.category?.id || "",
      tagIds: post.tags.map((t) => t.id),
      published: post.published,
    });
    setEditingId(post.id);
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
        <h1 className="text-3xl font-bold text-white">Blog</h1>
        <GradientButton onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          New Post
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
            {editingId ? "Edit Post" : "New Blog Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Excerpt</label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                rows={10}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 font-mono text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Cover Image URL</label>
              <input
                value={form.coverImage}
                onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white"
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Published</label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                    className="accent-blue-500"
                  />
                  Published
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      form.tagIds.includes(tag.id)
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-gray-500">No tags available</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <GradientButton type="submit">
                {editingId ? "Update Post" : "Create Post"}
              </GradientButton>
              <GradientButton type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </GradientButton>
            </div>
          </form>
        </GlassCard>
      )}

      <GlassCard>
        <h2 className="mb-4 text-xl font-semibold text-white">All Posts</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-white/5 text-white last:border-0">
                    <td className="py-3 pr-4 max-w-xs truncate">{post.title}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs ${
                          post.published
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {post.category?.name || <span className="text-gray-600">—</span>}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="rounded px-3 py-1 text-xs text-blue-400 transition hover:bg-blue-500/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteById(post.id)}
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
