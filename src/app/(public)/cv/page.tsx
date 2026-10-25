import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CV_COOKIE, verifyCvToken } from "@/lib/cvAccess";
import GalleryCard from "@/components/gallery/GalleryCard";

export const metadata: Metadata = {
  title: "CV | Ayoub Osama Ayoub",
  description: "Curriculum Vitae of Ayoub Osama Ayoub",
};

const ABOUT =
  "Software Engineer graduated from Üsküdar University, Istanbul. Focused on building practical software and AI-powered applications. Co-founded ventures, freelanced internationally, and built digital products.";

const SKILLS: { category: string; items: string[] }[] = [
  { category: "Languages", items: ["Python", "JavaScript / TypeScript", "C-C++", "SQL", "HTML / CSS"] },
  { category: "Frameworks", items: ["Next.js", "React", "Flutter", "FastAPI", "Node.js"] },
  { category: "AI / ML", items: ["LangChain", "OpenAI API", "RAG pipelines", "Vector stores", "Prompt engineering"] },
  { category: "Tools", items: ["Git", "Docker", "Supabase", "Firebase", "Figma", "Vercel", "AWS basics"] },
];

const EXPERIENCE = [
  {
    role: "Freelance Software Engineer",
    company: "Self-Employed",
    period: "Jun 2022 – Present",
    description:
      "Delivered 5+ project web/mobile projects for clients across Turkey, UAE, and Egypt. Stack: Next.js, Flutter, Supabase, OpenAI.",
  },
];

const EDUCATION = [
  {
    degree: "B.Sc. Software Engineering",
    institution: "Üsküdar University",
    period: "2021 – 2025",
    description: "Software Engineer graduated from Üsküdar University. Coursework: Data Structures, AI fundamentals, Distributed Systems, HCI.",
  },
  {
    degree: "High School Diploma",
    institution: "EMARIT PRIVET SCHOOL ALAIN ",
    period: "2018 – 2021",
  },
];

const LANGUAGES = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Fluent (C1)" },
  { name: "Turkish", level: "Conversational (B1)" },
];

export default async function CVPage() {
  const cookieStore = cookies();
  if (!(await verifyCvToken(cookieStore.get(CV_COOKIE)?.value))) redirect("/");

  return (
    <div className="min-h-screen bg-[#07060f] text-white py-8 px-4 md:py-12">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Ayoub Osama Ayoub
          </h1>
          <p className="text-sm text-white/50 mt-1">Software Engineer · AI · Entrepreneur</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-white/40">
            <span>ayoubosama2004@gmail.com</span>
            <span>Istanbul · Abu Dhabi</span>
          </div>
        </header>

        {/* Swipeable photo gallery — tap to fullscreen, swipe to browse */}
        <div className="flex justify-center">
          <GalleryCard />
        </div>

        {/* Download */}
        <div className="text-center">
          <a
            href="/cv.pdf"
            download="Ayoub_Osama_CV.pdf"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-shadow hover:shadow-lg hover:shadow-violet-500/25"
            style={{ background: "linear-gradient(135deg, #8b6cff, #2f7bff)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CV
          </a>
        </div>

        {/* About */}
        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-2">About</h2>
          <p className="text-sm text-white/60 leading-relaxed">{ABOUT}</p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Experience</h2>
          <div className="space-y-3">
            {EXPERIENCE.map((exp) => (
              <div key={exp.role + exp.company} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">{exp.role}</h3>
                    <p className="text-xs text-blue-400/80">{exp.company}</p>
                  </div>
                  <span className="text-[11px] text-white/30 whitespace-nowrap shrink-0">{exp.period}</span>
                </div>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Education</h2>
          <div className="space-y-3">
            {EDUCATION.map((edu) => (
              <div key={edu.degree + edu.institution} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">{edu.degree}</h3>
                    <p className="text-xs text-blue-400/80">{edu.institution}</p>
                  </div>
                  <span className="text-[11px] text-white/30 whitespace-nowrap shrink-0">{edu.period}</span>
                </div>
                {edu.description && (
                  <p className="text-xs text-white/50 mt-2 leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Skills</h2>
          <div className="space-y-4">
            {SKILLS.map(({ category, items }) => (
              <div key={category} className="glass rounded-2xl p-5">
                <h3 className="text-xs font-medium text-blue-400/80 uppercase tracking-wider mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/70 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Languages</h2>
          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map((lang) => (
              <div key={lang.name} className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-sm font-medium text-white">{lang.name}</span>
                <span className="text-[11px] text-white/40 mt-0.5">{lang.level}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="text-center pb-4">
          <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ← Back to profile
          </a>
        </div>

      </div>
    </div>
  );
}
