"use client";

import GradientButton from "@/components/ui/GradientButton";

interface HeroProps {
  name: string;
  title: string;
  locations?: string;
  email?: string;
}

export default function Hero({ name, title, locations }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .float-anim-delayed { animation: float 8s ease-in-out infinite; animation-delay: 2s; }
      `}</style>
      <div className="relative z-10 max-w-4xl text-center">
        <div className="mb-6 flex justify-center gap-4">
          <div className="float-anim h-4 w-4 rounded-full bg-blue-400/40" />
          <div className="float-anim-delayed h-6 w-6 rounded-full bg-purple-400/30" />
        </div>
        <h1 className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
          {name}
        </h1>
        <p className="mt-6 text-lg text-gray-300 md:text-xl">{title}</p>
        {locations && (
          <p className="mt-2 text-sm text-gray-500">{locations}</p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* <GradientButton href="/api/resume" variant="primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download CV
          </GradientButton> */}
          <GradientButton href="#contact" variant="outline">
            Contact Me
          </GradientButton>
          <GradientButton href="#projects" variant="outline">
            View Projects
          </GradientButton>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
}
