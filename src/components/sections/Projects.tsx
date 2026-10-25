"use client";

import { useState } from "react";

export interface Project {
  id: string;
  title: string;
  description: string;
  techBadges: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  category: string;
  images?: string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));
  const categories = ["All", ...uniqueCategories];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  function parseBadges(badges: string): string[] {
    try { return JSON.parse(badges); } catch { return []; }
  }

  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          <span className="text-cyan-400">My</span> Projects
        </h2>
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                active === cat
                  ? "bg-blue-600 text-white"
                  : "glass text-gray-300 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group glass rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:border-blue-500/30"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-400 line-clamp-3">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {parseBadges(project.techBadges).map((badge) => (
                    <span key={badge} className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-400 transition hover:text-white">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-400 transition hover:text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
