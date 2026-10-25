"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface Stats {
  projects: number;
  skills: number;
  blogPosts: number;
  services: number;
  testimonials: number;
  experience: number;
  education: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, skills, blog, services, testimonials, experience, education] =
          await Promise.all([
            fetch("/api/projects").then((r) => r.json()),
            fetch("/api/skills").then((r) => r.json()),
            fetch("/api/blog/posts").then((r) => r.json()),
            fetch("/api/services").then((r) => r.json()),
            fetch("/api/testimonials").then((r) => r.json()),
            fetch("/api/experience").then((r) => r.json()),
            fetch("/api/education").then((r) => r.json()),
          ]);
        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          blogPosts: Array.isArray(blog) ? blog.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          education: Array.isArray(education) ? education.length : 0,
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Projects", value: stats?.projects, href: "/admin/projects" },
    { label: "Skills", value: stats?.skills, href: "/admin/skills" },
    { label: "Blog Posts", value: stats?.blogPosts, href: "/admin/blog" },
    { label: "Services", value: stats?.services, href: "/admin/services" },
    { label: "Testimonials", value: stats?.testimonials, href: "/admin/testimonials" },
    { label: "Experience", value: stats?.experience, href: "/admin/experience" },
    { label: "Education", value: stats?.education, href: "/admin/education" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Welcome to the admin panel. Here&apos;s an overview of your site.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <GlassCard hover>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {loading ? (
                  <span className="inline-block h-8 w-12 animate-pulse rounded bg-white/10" />
                ) : (
                  card.value ?? <span className="text-sm text-red-400">Error</span>
                )}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>

      <GlassCard>
        <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <GradientButton href="/admin/profile">Edit Profile</GradientButton>
          <GradientButton href="/admin/projects" variant="secondary">Add Project</GradientButton>
          <GradientButton href="/admin/blog" variant="secondary">New Blog Post</GradientButton>
          <GradientButton href="/" variant="outline">View Site</GradientButton>
        </div>
      </GlassCard>
    </div>
  );
}
