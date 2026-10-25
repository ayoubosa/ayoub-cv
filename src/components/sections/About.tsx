"use client";

interface Stat {
  label: string;
  value: string;
}

interface AboutProps {
  about: string;
  photo?: string | null;
  stats: Stat[];
}

export default function About({ about, photo, stats }: AboutProps) {
  return (
    <section id="about" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          About <span className="text-blue-400">Me</span>
        </h2>
        <div className="grid gap-12 md:grid-cols-2">
          {photo && (
            <div className="flex items-center justify-center">
              <img
                src={photo}
                alt="Ayoub Osama Ayoub"
                className="h-80 w-80 rounded-2xl object-cover shadow-xl ring-1 ring-white/10"
              />
            </div>
          )}
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-lg leading-relaxed text-gray-300">{about}</p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-xl p-6 text-center transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl font-bold text-blue-400">{stat.value}</div>
              <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
